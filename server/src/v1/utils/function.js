const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
import crypto from "crypto";
/**
 * Generate Short String for short-url
 * @constructor
 * @param {number} length - Length to generate Random short URL.
 */

export function generateShortUrlString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.toLowerCase();
}

export const validateCustomURL = (customurl) => {
  return String(customurl).match(/^[a-zA-Z0-9_.-]*$/);
};

export const validateUrl = (url) => {
  return String(url).match(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
};

/**
 * Generate Short String
 * @function
 * @param {number} length - Length to generate Random short URL.
 */

export function generateUniqueString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  while (result.length < length) {
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < randomBytes.length; i++) {
      const charCode = randomBytes[i] % characters.length;
      result += characters.charAt(charCode);
    }
  }

  return result.slice(0, length);
}

// export function generateUniqueString(length) {
//   return crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString("hex")
//     .slice(0, length);
// }
