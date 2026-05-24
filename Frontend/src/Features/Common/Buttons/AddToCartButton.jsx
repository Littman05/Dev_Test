import { FaShoppingBag } from "react-icons/fa";

export function AddToCartButton({message="Add to Cart"}) {
  return (
    <>
      <div className="cart">
        <button className="btn-secondary h-12 w-full px-8 text-base">
        <FaShoppingBag  className="mr-2" /> {message}
        </button>
      </div>
    </>
  );
}
