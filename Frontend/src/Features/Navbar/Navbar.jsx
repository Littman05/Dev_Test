import { v4 as uuid } from "uuid";
import { CiHeart } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchParameters } from "../Product/ProductSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import logo from "../../assets/logo.png"

export function Navbar({ searchParameter, setSearchParameter }) {
  const [showMobileViewMenu, setShowMobileViewMenu] = useState(false); // for responsive menu
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectLoggedInUser);
  const { role } = user;

  let directLinks = [];
  if (role === "admin") {
    directLinks = [
      { name: "Orders", link: "admin/orders" },
      { name: "Products", link: "admin/products" },
    ];
  } else {
    directLinks = [
      { name: "Orders", link: "/myOrders" },
      { name: "Products", link: "/products" },
    ];
  }

  let mobileViewMenuOption = []
  if(role === "admin"){
    mobileViewMenuOption=[
      { name: "Products", link: "/products" },
      { name: "Orders", link: "/admin/orders" },
    ]
  }else{
    mobileViewMenuOption = [
      { name: "Products", link: "/products" },
      { name: "Wishlist", link: "/wishlist" },
      { name: "Cart", link: "/cart" },
    ];
  
  }
  

  let profileOptions = [];
  if (role === "admin") {
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "Orders", link: "admin/orders" },
      {
        name: user.userId ? "Logout" : "Login",
        link: user.userId ? "/logout" : "/login",
      },
    ];
  } else {
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "My Orders", link: "/myOrders" },
      {
        name: user.userId ? "Logout" : "Login",
        link: user.userId ? "/logout" : "/login",
      },
    ];
  }

  function openProfileMenuHandler(e) {
    e.stopPropagation();
    setShowProfileOptions((prevValue) => !prevValue);
  }

  function openMobileViewMenuHandler(e) {
    e.stopPropagation();
    setShowMobileViewMenu((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      setShowMobileViewMenu(false);
      setShowProfileOptions(false);
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchParameter) {
      navigate(role === "admin" ? "admin/products" : "/products");
    }
  }, [searchParameter]);

  useEffect(() => {
    dispatch(setSearchParameters(searchParameter));
  }, [searchParameter, dispatch]);

  return (
    <div className="navbar-wrapper sticky top-0 z-50 px-3 py-3">
      <div className="navbar relative mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-4 rounded-3xl border border-white/70 bg-slate-950/85 px-4 text-white shadow-soft backdrop-blur-xl sm:px-6">
        {/* image and links wrapper */}
        <div className="flex ">
          <div className="flex w-[40%] flex-row gap-10 items-center justify-start">
            <Link to="/">
              <div className="image mr-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-lg shadow-black/10">
                <img
                  src={logo}
                  alt="logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ul className="mr-4 hidden gap-2 md:flex">
            {directLinks.map((link) => (
              <li key={uuid()} className="cursor-pointer">
                <NavLink
                  to={link.link}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-slate-950"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* search bar */}
          <input
            type="text"
            className={`h-11 w-[170px] rounded-full border border-white/20 bg-white/95 px-4 text-sm text-slate-950 outline-none transition-transform duration-300 ease-out placeholder:text-slate-400 focus:ring-4 focus:ring-white/20 sm:w-[300px] ${
              showSearchBar
                ? "translate-x-0 opacity-100"
                : "translate-x-[220px] opacity-0"
            }
               ${showSearchBar ? "block" : "hidden"}
              `}
            value={searchParameter}
            placeholder="Search by product name"
            onChange={(e) => setSearchParameter(e.target.value)}
          />
          <div
            onClick={() => setShowSearchBar((prev) => !prev)}
            className="searchBox-wrapper flex cursor-pointer flex-col items-center justify-center rounded-2xl px-2 py-1 text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <div className="search-icon flex cursor-pointer items-center justify-center">
              <IoIosSearch className="h-6 w-6 mx-auto" />
            </div>

            <span className="text-sm">Search</span>
          </div>

          <ul className="user-links hidden md:flex md:flex-row md:gap-2">
            {role !== "admin" && (
              <>
                <div
                  key={uuid()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Link to="/wishlist">
                    <CiHeart className="h-6 w-6 mx-auto" />
                    <span className="text-sm">Wishlist</span>
                  </Link>
                </div>

                <div
                  key={uuid()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Link to="/cart">
                    <BsCart className="h-6 w-6 " />
                    <span className="text-sm">Cart</span>
                  </Link>
                </div>
              </>
            )}

            <div
              key={uuid()}
              className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-slate-200 transition hover:bg-white/10 hover:text-white"
              onClick={openProfileMenuHandler}
            >
              <CiUser className="h-6 w-6 " />
              <span className="text-sm">Profile</span>
            </div>

            {/* profile dropdown menu */}
            <div
              className={`${
                showProfileOptions ? "flex" : "hidden"
              } profile-menu menu-panel absolute right-0 top-[110%] z-10 flex w-[220px] flex-col overflow-hidden py-2`}
            >
              {profileOptions.map((option) => (
                <Link key={uuid()} to={option.link}>
                  <div className="flex h-[42px] cursor-pointer items-center px-4 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                    {option.name}
                  </div>
                </Link>
              ))}
            </div>
          </ul>

          {/* mobile view menu start*/}
          <div
            className="flex flex-col items-center justify-center gap-[2px] rounded-2xl p-2 transition hover:bg-white/10 md:hidden"
            onClick={openMobileViewMenuHandler}
          >
            {showMobileViewMenu ? (
              <RxCross1 className="h-7 w-7" />
            ) : (
              <IoIosMenu className="h-7 w-7" />
            )}
          </div>
          <ul
            className={`${
              showMobileViewMenu ? "block" : "hidden"
            } burger-menu menu-panel absolute right-0 top-[115%] z-50 w-full overflow-hidden text-slate-900 sm:w-[380px] md:hidden`}
          >
            {mobileViewMenuOption.map((link) => (
              <Link key={uuid()} to={link.link}>
                <div className="flex h-12 items-center px-5 font-semibold transition hover:bg-brand-50 hover:text-brand-700">
                  {link.name}
                </div>
              </Link>
            ))}
            <hr className="border-slate-200" />
            {profileOptions.map((option) => (
              <Link key={uuid()} to={option.link}>
                <div className="flex h-12 items-center px-5 font-semibold transition hover:bg-brand-50 hover:text-brand-700">
                  {option.name}
                </div>
              </Link>
            ))}
          </ul>
          {/* mobile view menu ends */}
        </div>
      </div>
    </div>
  );
}
