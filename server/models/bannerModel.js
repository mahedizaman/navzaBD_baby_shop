const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    startFrom: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    bannerType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Banner", bannerSchema);
