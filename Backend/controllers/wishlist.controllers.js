const User = require("../models/user.model");
const Product = require("../models/product.model")
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const wishlistItems = asyncHandler(async (req, res,next) => {
  const { id: userId } = req.body.user;
  const fetchedUser = await User.findById(userId).populate({
    path: "wishlist",
    select: "thumbnail quantity price title description discountPercentage",
  });

  if (!fetchedUser) {
    return next(new ApiError(404, "User not found"));
  }

  const { wishlist } = fetchedUser;

  return res
    .status(200)
    .json(
      new ApiResponse(200, "wishlist items fetched successfully", wishlist)
    );
});

const addToWishlist = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.body.user;
  const { productId } = req.body;

  if (!productId) {
    return next(new ApiError(400, "Product id is required"));
  }

  const fetchedUser = await User.findById(userId).select("wishlist");
  if (!fetchedUser) {
    return next(new ApiError(404, "User not found"));
  }

  if (!fetchedUser.wishlist) {
    return next(new ApiError(400, "Couldn't fetch wishlist"));
  }

  const isAlreadyAdded = fetchedUser.wishlist.find(
    (itemId) => itemId.toString() === productId.toString()
  );
  if (isAlreadyAdded) {
    return next(new ApiError(409, "Already added!"));
  }

  const updatedWishlist = [...fetchedUser.wishlist, productId];

  fetchedUser.wishlist = updatedWishlist;
  const productDetail = await Product.findById(productId).select(
    "thumbnail quantity price title description discountPercentage"
  );

  if (!productDetail) {
    return next(new ApiError(404, "Product not found"));
  }

  await fetchedUser.save();

  return res.status(200).json(new ApiResponse(200, "Successfully Added",productDetail));
});

const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.body.user;
  const { productId } = req.body;

  if (!productId) {
    return next(new ApiError(400, "Product id is required"));
  }

  const fetchedUser = await User.findById(userId).select("wishlist");
  if (!fetchedUser) {
    return next(new ApiError(404, "User not found"));
  }

  if (!fetchedUser.wishlist) {
    return next(new ApiError(400, "Couldn't fetch wishlist"));
  }

  const isAlreadyAdded = fetchedUser.wishlist.find(
    (itemId) => itemId.toString() === productId.toString()
  );
  if (!isAlreadyAdded) {
    return next(new ApiError(409, "Product not found in wishlist!"));
  }

  const updatedWishlist = fetchedUser.wishlist.filter(
    (itemId) => itemId.toString() !== productId.toString()
  );

  fetchedUser.wishlist = updatedWishlist;

  await fetchedUser.save();

  return res.status(200).json(new ApiResponse(200, "Successfully Removed"));
});

module.exports = {
  wishlistItems,
  addToWishlist,
  removeFromWishlist,
};
