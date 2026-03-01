const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 80 },
    stock: { type: Number, required: true, default: 0 },

    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    averageRating: { type: Number, default: 0 },

    image: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discountPercentage) / 100;
});

productSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((a, b) => a + b.rating, 0);
  return sum / this.ratings.length;
};

productSchema.pre("save", function (next) {
  this.averageRating = this.calculateAverageRating();
  next();
});

module.exports = mongoose.model("Product", productSchema);