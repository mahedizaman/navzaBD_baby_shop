const Banner = require("../models/bannerModel");

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      startFrom: 1,
    });
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
    const { name, title, startFrom, image, bannerType, isActive } = req.body;

    const banner = new Banner({
      name,
      title,
      startFrom,
      image,
      bannerType,
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
    const { name, title, startFrom, image, bannerType, isActive } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error("Banner not found");
    }

    banner.name = name || banner.name;
    banner.title = title || banner.title;
    banner.startFrom = startFrom || banner.startFrom;
    banner.image = image || banner.image;
    banner.bannerType = bannerType || banner.bannerType;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;

    const updatedBanner = await banner.save();
    res.status(200).json(updatedBanner);
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error("Banner not found");
    }

    await banner.deleteOne();
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    next(error);
  }
};
