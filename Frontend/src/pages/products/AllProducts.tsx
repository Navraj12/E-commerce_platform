import { useEffect, useMemo, useState } from "react";
import Card from "../../globals/components/card/Card.tsx";
import Footer from "../../globals/components/footer/Footer.tsx";
import BasketSidebar from "../../globals/components/basketSidebar/BasketSidebar.tsx";
import { Status } from "../../globals/types/types.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchProducts } from "../../store/productSlice.ts";

type SortOption = "" | "price-asc" | "price-desc" | "rating-desc";

// Dedicated "view all products" page. Reuses the same fetchProducts thunk
// and Card rendering as the homepage grid, but shows the full catalog with
// no slicing/limiting, plus lightweight category/price/sort filters.
const AllProducts = () => {
  const dispatch = useAppDispatch();
  const { product, status } = useAppSelector((state) => state.products);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("");

  useEffect(() => {
    const [sortBy, order] = sortOption
      ? (sortOption.split("-") as ["price" | "rating", "asc" | "desc"])
      : [undefined, undefined];
    dispatch(
      fetchProducts({
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy,
        order,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, minPrice, maxPrice, sortOption]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    product.forEach((p) => {
      if (p.Category?.id) map.set(p.Category.id, p.Category.categoryName);
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [product]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return product;
    return product.filter((p) => p.Category?.id === activeCategory);
  }, [product, activeCategory]);

  return (
    <div className="m-0 box-border p-0">
      <div className="bg-white px-4 py-12 text-gray-600 dark:bg-gray-900 lg:px-8">
        <div className="container mx-auto xl:max-w-7xl">
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                All products
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Browse the full catalog
              </p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === "all"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    activeCategory === cat.id
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1 w-28 rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1 w-28 rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Any"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="mt-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>

          {status === Status.LOADING && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          )}

          {status !== Status.LOADING && filteredProducts.length === 0 && (
            <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
              No products available right now. Check back soon!
            </p>
          )}

          {status !== Status.LOADING && filteredProducts.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((pd) => (
                <Card key={pd.id} data={pd} badge="Marketplace" showSoldBy />
              ))}
            </div>
          )}
            </div>

            {/* Basket sidebar */}
            <div className="lg:col-span-1">
              <BasketSidebar />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllProducts;
