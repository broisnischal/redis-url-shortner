import Url from "../models/urlModel.js";
/**
 * Generate Short String for short-url
 * @function
 * @param {string} shortURL - Short URL.
 */

export const updateRedirect = async (shortURL, req) => {
  await Url.findOneAndUpdate(
    { shortURL },
    {
      $inc: { redirect: 1 },
    }
  );

  if (req.device.type === "desktop") {
    await Url.findOneAndUpdate(
      { shortURL },
      {
        $inc: { desktopType: 1 },
      }
    );
  }
  if (req.device.type === "phone") {
    await Url.findOneAndUpdate(
      { shortURL },
      {
        $inc: { mobileType: 1 },
      }
    );
  }
};
