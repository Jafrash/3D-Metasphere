import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

/**
 * https://dev.to/advename/comment/24a9e
 */
const keyLength = 32;

/**
 * Has a password or a secret with a password hashing algorithm (scrypt)
 * @param {string} password
 * @returns {string} The salt+hash
 */
export const hash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const salt = randomBytes(16).toString('hex'); // Generate random salt
      scrypt(password, salt, keyLength, (error, derivedKey) => {
        if (error) {
          reject(error); // Reject if scrypt fails
        } else {
          resolve(`${salt}.${derivedKey.toString('hex')}`); // Resolve with salt and hash
        }
      });
    } catch (error) {
      reject(error); // Handle unexpected errors
    }
  });
};


/**
 * Compare a plain text password with a salt+hash password
 * @param {string} password The plain text password
 * @param {string} hash The hash+salt to check against
 * @returns {boolean}
 */
export const compare = (password: string, storedHash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const [salt, hashKey] = storedHash.split('.'); // Split the salt and hash
      if (!salt || !hashKey) {
        reject(new Error('Invalid hash format'));
        return;
      }

      const hashKeyBuff = Buffer.from(hashKey, 'hex'); // Convert hash to Buffer
      scrypt(password, salt, keyLength, (error, derivedKey) => {
        if (error) {
          reject(error); // Reject if scrypt fails
        } else {
          resolve(timingSafeEqual(hashKeyBuff, derivedKey)); // Resolve comparison result
        }
      });
    } catch (error) {
      reject(error); // Handle unexpected errors
    }
  });
};
