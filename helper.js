const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generate Short String for short-url
 * @constructor
 * @param {number} length - Length to generate Random short URL.
 */

function generateShortUrl(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const validateCustomURL = (customurl) => {
  return String(customurl).match(/^[a-zA-Z0-9_.-]*$/);
};

module.exports = {
  generateShortUrl,
  validateCustomURL,
};
