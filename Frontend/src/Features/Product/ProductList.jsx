import { MdKeyboardArrowDown } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { ProductCard } from "../Common/ProductCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllProductsAsync,
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
  selectProductState,
} from "../Product/ProductSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { selectSearchParameters } from "./ProductSlice";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../Common/Pagination";
import { Loader } from "../../utils/Loader";


export function ProductList() {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filter, setFilter] = useState({ category: [], brand: [] });
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const state = useSelector(selectProductState);
  const searchParameter = useSelector(selectSearchParameters);
  const user = useSelector(selectLoggedInUser);

  const {role} = user 

  const sortOptions = [
    { name: "Price: Low to High", sortBy: "price", order: "asc" },
    { name: "Price: High to Low", sortBy: "price", order: "desc" },
    { name: "Better Discount", sortBy: "discountPercentage", order: "desc" },
  ];

  // selected filters handler
  const filterHandler = (value, filterType) => {
    const isFilterAlreadySelected = filter[filterType].find(
      (val) => val === value
    );
    let newFilters = [];
    if (isFilterAlreadySelected) {
      newFilters = {
        ...filter,
        [filterType]: [...filter[filterType].filter((val) => val !== value)],
      };
    } else {
      newFilters = { ...filter, [filterType]: [...filter[filterType], value] };
    }

    setFilter(newFilters);
  };

  // fetching products using debouncing
  useEffect(() => {
    const timeOut = setTimeout(() => {
 
      dispatch(fetchAllProductsAsync({ filter, page, sort, searchParameter ,role}));
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [filter, page, sort, searchParameter,role]);

  // fetching brands and categories
  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  // add product button handler only for ADMIN
  function addProductHandler() {
    navigate("/admin/products/create");
  }

  function showSortMenuClickHandler(e) {
    e.stopPropagation();
    setShowSortMenu((prevValue) => !prevValue);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      setShowSortMenu(false);
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="page-shell pb-16">
      {/* header */}
      <div className="header glass-panel relative mt-8 flex min-h-[120px] flex-col justify-center gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-600">
            ShopCart Collection
          </p>
          <div className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            All Products
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Discover curated sample products for every shopping flow.
          </p>
        </div>
        <div className="flex cursor-pointer flex-row items-center justify-end gap-2">
          <span className="btn-secondary" onClick={showSortMenuClickHandler}>
            Sort
          </span>
          <span>
            <MdKeyboardArrowDown
              className="h-6 w-6"
              onClick={showSortMenuClickHandler}
            />
          </span>
          <span>
            <CiFilter
              className="ml-1 h-10 w-10 rounded-full border border-slate-200 bg-white p-2 lg:hidden"
              onClick={() => setShowMobileFilters((prevValue) => !prevValue)}
            />
          </span>
        </div>

        {/* sort drop-down menu  */}
        <div
          className={`${
            showSortMenu ? "flex" : "hidden"
          } sort-menu menu-panel absolute right-6 top-[82%] z-10 w-[240px] flex-col overflow-hidden py-2`}
        >
          {sortOptions.map((sortOption) => (
            <div
            key={uuid()}
              className={`flex cursor-pointer items-center px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 ${
                sort &&
                sortOption.sortBy === sort._sort &&
                sortOption.order === sort._order
                  ? "bg-brand-50 text-brand-700"
                  : ""
              } `}
              onClick={() =>
                setSort({ _sort: sortOption.sortBy, _order: sortOption.order })
              }
            >
              {sortOption.name}
            </div>
          ))}
        </div>
      </div>
      <div className="products-wrappper relative mt-8 flex flex-row gap-8">
        {/* filters -web view */}
        <DesktopFilters
          state={state}
          filterHandler={filterHandler}
          filter={filter}
          setFilter={setFilter}
        />

        {/* products */}
        <div className="wrapper w-full lg:w-[75%]">
          {user && user.role === "admin" && (
            <button
              className="btn-primary mb-5"
              onClick={addProductHandler}
            >
              Add Product
            </button>
          )}
          {state.status.products === "loading" && (
            <Loader/>
          )}
          {state.error.products && (
            <div className="block text-black text-3xl font-semibold">
              {state.error.products}
            </div>
          )}

          {state.products && state.products.length === 0 ? (
            <div className="glass-panel p-8 text-center text-2xl font-bold text-slate-900">
              No product found{" "}
            </div>
          ) : (
            // <div className="products-container w-full flex flex-wrap sm:gap-4 justify-between sm:justify-normal">
             <div className="products-container grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"> 
              
              {state.products?.map((product,index) => (
                <div key={product._id || index} className="flex items-center justify-center"> 
                  <ProductCard
                    {...product}

                  />
                   </div>
              ))}
             

            {/* </div> */}
            </div>  
          )}

          <hr className="mt-10 border-slate-200"></hr>
          <Pagination
            totalDocs={state.totalProducts}
            page={page}
            setPage={setPage}
          ></Pagination>
        </div>
      </div>

      {/* filters-mobile view */}
      <MobileFilters
        state={state}
        filterHandler={filterHandler}
        filter={filter}
        setFilter={setFilter}
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
      />
    </div>
  );
}

function DesktopFilters({ state, filter, filterHandler }) {
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [showBrandFilters, setShowBrandFilters] = useState(false);

  return (
    <>
      <div className="filters glass-panel hidden h-fit w-[25%] p-4 lg:block">
        <div
          className="flex cursor-pointer flex-row justify-between rounded-2xl px-3 py-4 text-slate-950 transition hover:bg-brand-50"
          onClick={() => setShowCategoryFilters((prevValue) => !prevValue)}
        >
          <span className="text-lg font-bold">Category</span>
          <span className="font-semibold text-lg">
            {showCategoryFilters ? <FaMinus /> : <FaPlus />}
          </span>
        </div>
        {/* category filters */}
        <div
          className={`${
            showCategoryFilters ? "flex" : "hidden"
          } category-filters-wrapper w-full flex-col items-center pb-4`}
        >
          {state.error.categories && (
            <div className="block text-black text-lg ">
              {state.error.categories}
            </div>
          )}
          {state.filters.categories === undefined ? (
            <p>No category found</p>
          ) : (
            state.filters.categories.map(({ label }) => {
              return (
                <label
                  key={uuid()}
                  className="flex min-h-[40px] w-full flex-row items-center gap-3 rounded-xl px-3 transition hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand-600"
                    value={label}
                    checked={filter.category.includes(label)}
                    onChange={(e) => filterHandler(label, "category")}
                  />
                  <span className="flex flex-row text-sm font-medium capitalize text-slate-600">
                    {label}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <hr className="border-slate-200" />

        {/* brand filters */}
        <div
          className="flex cursor-pointer flex-row justify-between rounded-2xl px-3 py-4 text-slate-950 transition hover:bg-brand-50"
          onClick={() => setShowBrandFilters((prevValue) => !prevValue)}
        >
          <span className="text-lg font-bold">Brands</span>
          <span className="font-semibold text-lg text-center">
            {showBrandFilters ? <FaMinus /> : <FaPlus />}
          </span>
        </div>

        <div
          className={`${
            showBrandFilters ? "flex" : "hidden"
          } brand-filters-wrapper w-full flex-col items-center pb-4`}
        >
          {state.error.brands && (
            <div className="block text-black text-lg">{state.error.brands}</div>
          )}
          {state.filters.brands === undefined ? (
            <p>No brand found</p>
          ) : (
            state.filters.brands.map(({ label }) => (
              <label
                key={uuid()} 
                className="flex min-h-[40px] w-full flex-row items-center gap-3 rounded-xl px-3 transition hover:bg-slate-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand-600"
                  value={label}
                  checked={filter.brand.includes(label)}
                  onChange={(e) => filterHandler(label, "brand")}
                />
                <span className="text-sm font-medium capitalize text-slate-600">{label}</span>
              </label>
            ))
          )}
        </div>
        <hr className="border-slate-200" />
      </div>
    </>
  );
}

function MobileFilters({
  state,
  filter,
  setShowMobileFilters,
  showMobileFilters,
  filterHandler,
}) {
  const [showMobileCategoryFilters, setShowMobileCategoryFilters] =
    useState(false);
  const [showMobileBrandFilters, setShowMobileShowBrandFilters] =
    useState(false);

  return (
    <>
      <div
        className={`${
          showMobileFilters ? "flex" : "hidden "
        } mobile-filters-container fixed right-0 top-0 z-50 h-full w-full flex-col overflow-y-scroll border-l border-slate-200 bg-white shadow-soft vsm:w-[380px] lg:hidden`}
      >
        <div className="flex h-[80px] flex-row items-center justify-between p-5">
          <span className="text-xl font-black text-slate-950">Filters</span>
          <RxCross1
            className="cursor-pointer rounded-full border border-slate-200 p-2 text-4xl text-slate-700"
            onClick={() => setShowMobileFilters((prevValue) => !prevValue)}
          />
        </div>

        <hr className="border-slate-200" />

        <div
          className="flex h-[80px] flex-row items-center justify-between p-5"
          onClick={() =>
            setShowMobileCategoryFilters((prevValue) => !prevValue)
          }
        >
          <span className="text-lg font-bold">Category</span>
          {showMobileCategoryFilters ? (
            <FaMinus className="font-semibold text-xl cursor-pointer" />
          ) : (
            <FaPlus className="font-semibold text-xl cursor-pointer" />
          )}
        </div>
        <div
          className={`${
            showMobileCategoryFilters ? "flex" : "hidden"
          } category-filters-wrapper w-full flex-col items-center px-5 pb-4`}
        >
          {state.error.categories && (
            <div className="block text-black text-lg">
              {state.error.categories}
            </div>
          )}
          {state.filters.categories === undefined ? (
            <p>No category found</p>
          ) : (
            state.filters.categories.map(({ label }) => {
              return (
                <label
                  key={uuid()}
                  className="flex min-h-[42px] w-full flex-row items-center gap-3 rounded-xl"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand-600"
                    value={label}
                    checked={filter.category.includes(label)}
                    onChange={(e) => filterHandler(label, "category")}
                  />
                  <span className="flex flex-row text-sm font-medium capitalize text-slate-600">
                    {label}
                  </span>
                </label>
              );
            })
          )}
        </div>
        <hr className="border-slate-200" />

        <div
          className="flex h-[80px] flex-row items-center justify-between p-5"
          onClick={() =>
            setShowMobileShowBrandFilters((prevValue) => !prevValue)
          }
        >
          <span className="text-lg font-bold">Brand</span>
          {showMobileBrandFilters ? (
            <FaMinus className="font-semibold text-xl cursor-pointer" />
          ) : (
            <FaPlus className="font-semibold text-xl cursor-pointer" />
          )}
        </div>
        <div
          className={`${
            showMobileBrandFilters ? "flex" : "hidden"
          } brand-filters-wrapper w-full flex-col items-center px-5 pb-4`}
        >
          {state.error.brands && (
            <div className="block text-black text-lg">{state.error.brands}</div>
          )}
          {state.filters.brands === undefined ? (
            <p>No brand found</p>
          ) : (
            state.filters.brands.map(({ label }) => (
              <label 
                key={uuid()}
                className="flex min-h-[42px] w-full flex-row items-center gap-3 rounded-xl">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand-600"
                  value={label}
                  checked={filter.brand.includes(label)}
                  onChange={(e) => filterHandler(label, "brand")}
                />
                <span className="text-sm font-medium capitalize text-slate-600">{label}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </>
  );
}
