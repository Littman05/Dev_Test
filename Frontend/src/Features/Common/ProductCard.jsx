import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateProductAsync } from "../ProductDetail/ProductDetailSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import {
  selectWishlistItems,
  removeFromWishlistAsync,
  addToWishlistAsync,
} from "../Wishlist/WishlistSlice";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

export function ProductCard({
  _id,
  thumbnail,
  title,
  brand,
  discountPercentage,
  stock,
  price,
  deleted,
}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addOrDeleteProductStatus, setAddOrDeleteProductStatus] =
    useState(false);
  const [isDeleted, setIsDeleted] = useState(deleted);

  const editProductHandler = (e) => {
    e.preventDefault();
    navigate(`/admin/product/${_id}`);
  };

  const user = useSelector(selectLoggedInUser);

  // check if product is in wishlist
  const wishlistItems = useSelector(selectWishlistItems);
  let isProductInWishlist = false;

  if (user && user.role !== "admin") {
    if (wishlistItems.length > 0) {
      isProductInWishlist = wishlistItems.find(
        (item) => item._id.toString() === _id.toString()
      );
    }
  }

  const ProductStatusHandler = async (e) => {
    e.preventDefault();
    setAddOrDeleteProductStatus(true);
    const fieldsToBeUpdated = {
      deleted: !isDeleted,
    };
    const response = await dispatch(updateProductAsync({ _id, fieldsToBeUpdated ,navigate}));
    if(response?.payload?.data?.statusCode === 200){
      setIsDeleted((prev) => !prev);
    }
    setAddOrDeleteProductStatus(false);
  };

  function handleAddOrRemoveFromWishlist(e) {
    e.stopPropagation();
    e.preventDefault();
    if (isProductInWishlist) {
      dispatch(removeFromWishlistAsync({ productId: _id ,navigate}));
    } else {
      dispatch(addToWishlistAsync({ productId: _id ,navigate}));
    }
  }

  function clickHandler(){
    navigate(`/products/${_id}`)
  }

  return (
    <div
      className="modern-card group flex w-[44vw] max-w-72 flex-col justify-between overflow-hidden p-3 text-slate-950 sm:w-[44vw] md:w-64"
    >
      <div className="content-wrapper flex h-[300px] flex-col justify-between">
        <div className="image-wrapper relative flex h-[62%] flex-shrink-0 justify-center overflow-hidden rounded-2xl bg-slate-100">
          {discountPercentage > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
              {discountPercentage}% OFF
            </span>
          )}
          <img
            onClick={clickHandler}
            src={thumbnail}
            alt={title}
            className="h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="product-details mt-4 flex flex-row gap-3">
          <div className="details min-w-0 flex-1">
            <div className="brand overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              {brand}
            </div>
            <div className="title mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-900">
              {title}
            </div>
          </div>

          {user && user.role !== "admin" && (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-sm transition hover:border-brand-200 hover:bg-brand-50"
              onClick={handleAddOrRemoveFromWishlist}
            >
              {isProductInWishlist ? (
                <FaHeart className="h-4 w-4" />
              ) : (
                <CiHeart className="h-6 w-6" />
              )}
            </div>
          )}
        </div>

        <div className="price mt-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-lg font-extrabold text-slate-950">
            ${Math.floor(((100 - discountPercentage) / 100) * price)}
          </span>
          <span className="ml-2 text-sm font-semibold text-slate-400">
            $<strike>{price}</strike>
          </span>
        </div>
      </div>

      
        
        {user && user.role === "admin" && (
          <div className="button-wrapper mt-4 flex flex-col justify-between gap-2 sm:flex-row">
            <button
              className="btn-primary px-4 py-2"
              onClick={(e) => editProductHandler(e)}
            >
              Edit
            </button>

            <button
              className="btn-secondary px-4 py-2"
              onClick={(e) => ProductStatusHandler(e)}
            >
              {addOrDeleteProductStatus
                ? isDeleted
                  ? "Adding"
                  : "Deleting"
                : isDeleted
                ? "Add"
                : "Delete"}
            </button>
          </div>
        )}
          <div className="mt-3 flex justify-between text-sm font-semibold text-red-600">
            
              {stock ===0 && <p className="text-sm text-red-600">Out of stock</p>}
            
            {user && user.role === "admin" &&  isDeleted ? "deleted" : ""}
          </div>
        
      </div>
  );



}
