/**
 * Biometric & WebAuthn Authentication Utility
 * Implements real WebAuthn PublicKeyCredential authentication with Touch ID / Face ID / Windows Hello / Android Fingerprint,
 * with graceful secure PIN fallback.
 */

export async function isBiometricAuthSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  
  try {
    if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch {
    return false;
  }
  return true;
}

/**
 * Generate SHA-256 hash for secure PIN storage
 */
export async function hashPin(pin: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + '_arogya_secure_salt_2026');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    hash = ((hash << 5) - hash) + pin.charCodeAt(i);
    hash |= 0;
  }
  return `fallback_${Math.abs(hash)}`;
}

/**
 * Enroll Biometrics with WebAuthn
 */
export async function enrollBiometrics(username: string): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  try {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'WebAuthn is not supported on this browser.' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'ArogyaSync Health Hub',
        id: window.location.hostname || 'localhost',
      },
      user: {
        id: userId,
        name: username || 'health_user',
        displayName: 'Health Member',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Built-in Touch ID, Face ID, Windows Hello, Fingerprint
        userVerification: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    };

    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential | null;

    if (credential) {
      return {
        success: true,
        credentialId: credential.id,
      };
    }

    return { success: false, error: 'Biometric enrollment was cancelled.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Biometric setup failed';
    return { success: false, error: errorMsg };
  }
}

/**
 * Verify Biometric Authentication with WebAuthn
 */
export async function verifyBiometrics(credentialId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'WebAuthn not supported' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: 'preferred',
      rpId: window.location.hostname || 'localhost',
    };

    if (credentialId) {
      try {
        // Convert base64 or id string to buffer
        const encoder = new TextEncoder();
        publicKeyCredentialRequestOptions.allowCredentials = [
          {
            id: encoder.encode(credentialId),
            type: 'public-key',
          },
        ];
      } catch {
        // Continue with discovery mode
      }
    }

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (assertion) {
      return { success: true };
    }
    return { success: false, error: 'Biometric verification unsuccessful' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Verification failed';
    return { success: false, error: errorMsg };
  }
}
