import { FaHeart } from "react-icons/fa";

export function AddToWishlistButton({message="Add To Wishlist"}) {
  return (
    <>
      <div className="cart">
        <button className="btn-primary h-12 w-full px-8 text-base">
        <FaHeart className="mr-2" /> {message}
        </button>
      </div>
    </>
  );
}
