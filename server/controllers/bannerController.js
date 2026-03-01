const Banner = require("../models/bannerModel");

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({});
    res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
};

exports.getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error("Banner not found");
    }

    res.status(200).json(banner);
  } catch (error) {
    next(error);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, isActive } =
      req.body;

    const banner = new Banner({
      title,
      subtitle,
      image,
      buttonText,
      buttonLink,
      isActive,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    next(error);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, isActive } =
      req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = title || banner.title;
      banner.subtitle = subtitle || banner.subtitle;
      banner.image = image || banner.image;
      banner.buttonText = buttonText || banner.buttonText;
      banner.buttonLink = buttonLink || banner.buttonLink;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;

      const updatedBanner = await banner.save();
      res.status(200).json(updatedBanner);
    } else {
      res.status(404);
      throw new Error("Banner not found");
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      await banner.deleteOne();
      res.status(200).json({ message: "Banner deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Banner not found");
    }
  } catch (error) {
    next(error);
  }
};
