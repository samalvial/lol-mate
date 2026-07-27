/**
 * Zero-Trust Encrypted Vault Service
 * Uses Web Crypto API with AES-256-GCM encryption & PBKDF2 key derivation.
 * Ensures zero plain-text API keys or user data are stored on disk or accessible without authorization.
 */

const STORAGE_KEY = 'riftcoach_vault_encrypted_v1';
const SALT_KEY = 'riftcoach_vault_salt_v1';

// Convert string to Uint8Array
function strToBuf(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to string
function bufToStr(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

// Convert ArrayBuffer to Hex string
function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex string to Uint8Array
function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Get or generate cryptographic salt
function getSalt(): Uint8Array {
  let saltHex = localStorage.getItem(SALT_KEY);
  if (!saltHex) {
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt as unknown as Uint8Array);
    saltHex = bufToHex(salt.buffer as unknown as ArrayBuffer);
    localStorage.setItem(SALT_KEY, saltHex);
    return salt;
  }
  return hexToBuf(saltHex);
}

// Derive AES-256 Key from Master Passcode using PBKDF2
async function deriveKey(passcode: string): Promise<CryptoKey> {
  const salt = getSalt();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    strToBuf(passcode) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedDataPayload {
  riotApiKey?: string;
  geminiApiKey?: string;
  userNotes?: string;
  accountRiotId?: string;
}

export class CryptoVault {
  private static inMemoryVault: EncryptedDataPayload | null = null;
  private static isVaultUnlocked: boolean = false;

  /**
   * Check if an encrypted vault exists in storage
   */
  static hasVault(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  /**
   * Check if vault is currently unlocked in memory
   */
  static isUnlocked(): boolean {
    return this.isVaultUnlocked;
  }

  /**
   * Lock vault and purge in-memory keys
   */
  static lockVault(): void {
    this.inMemoryVault = null;
    this.isVaultUnlocked = false;
  }

  /**
   * Save and Encrypt data with Master Passcode
   */
  static async saveVault(passcode: string, payload: EncryptedDataPayload): Promise<boolean> {
    try {
      const key = await deriveKey(passcode);
      const iv = new Uint8Array(12);
      window.crypto.getRandomValues(iv as unknown as Uint8Array);
      const jsonString = JSON.stringify(payload);

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv as unknown as BufferSource,
        },
        key,
        strToBuf(jsonString) as unknown as BufferSource
      );

      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      const cipherHex = bufToHex(combined.buffer as unknown as ArrayBuffer);
      localStorage.setItem(STORAGE_KEY, cipherHex);

      this.inMemoryVault = { ...payload };
      this.isVaultUnlocked = true;
      return true;
    } catch (err) {
      console.error('Failed to encrypt vault data:', err);
      return false;
    }
  }

  /**
   * Unlock and Decrypt vault with Master Passcode
   */
  static async unlockVault(passcode: string): Promise<EncryptedDataPayload | null> {
    try {
      const cipherHex = localStorage.getItem(STORAGE_KEY);
      if (!cipherHex) return null;

      const combined = hexToBuf(cipherHex);
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);

      const key = await deriveKey(passcode);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv as unknown as BufferSource,
        },
        key,
        ciphertext as unknown as BufferSource
      );

      const jsonString = bufToStr(decryptedBuffer);
      const data = JSON.parse(jsonString) as EncryptedDataPayload;

      this.inMemoryVault = data;
      this.isVaultUnlocked = true;
      return data;
    } catch (err) {
      console.warn('Failed to decrypt vault with provided passcode:', err);
      return null;
    }
  }

  /**
   * Get decrypted credentials if unlocked
   */
  static getCredentials(): EncryptedDataPayload | null {
    if (!this.isVaultUnlocked) return null;
    return this.inMemoryVault;
  }
}
