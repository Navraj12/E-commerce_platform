import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../globals/components/card/Card.tsx";
import Footer from "../../globals/components/footer/Footer.tsx";
import { Status } from "../../globals/types/types.ts";
import { verifyKhaltiPayment } from "../../store/checkoutSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchProducts } from "../../store/productSlice.ts";
import GreetingStrip from "./components/GreetingStrip.tsx";
import Hero from "./components/Hero.tsx";
import InspirationBand from "./components/InspirationBand.tsx";
import TopPicks from "./components/TopPicks.tsx";

type SortOption = "" | "price-asc" | "price-desc" | "rating-desc";

const Home = () => {
  const dispatch = useAppDispatch();
  const { product, status } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!(localStorage.getItem("token") || user?.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("category") ?? "all"
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchTerm = searchParams.get("search") ?? "";

  // Keep activeCategory in sync when navigated to with a `category` query
  // param (e.g. from the Navbar category icons/links).
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setActiveCategory(categoryParam ?? "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("category")]);

  useEffect(() => {
    const [sortBy, order] = sortOption
      ? (sortOption.split("-") as ["price" | "rating", "asc" | "desc"])
      : [undefined, undefined];
    dispatch(
      fetchProducts({
        search: searchTerm || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy,
        order,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchTerm, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) return;
    const khaltiStatus = searchParams.get("status");
    setSearchParams({}, { replace: true });
    if (khaltiStatus && khaltiStatus !== "Completed") {
      toast.error("Payment was not completed.");
      return;
    }
    dispatch(verifyKhaltiPayment(pidx)).then((verified: boolean) => {
      if (verified) {
        toast.success("Payment verified successfully!");
      } else {
        toast.error("We couldn't verify your payment. Please check your orders.");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {isAuthenticated && <GreetingStrip />}

      <Hero />

      <TopPicks products={product} />

      <div
        id="top-products"
        className="bg-white px-4 py-12 text-gray-600 dark:bg-gray-900 lg:px-8"
      >
        <div className="container mx-auto xl:max-w-7xl">
          {/* Section header row: heading + subtext on the left, item count
              and "View all" on the right, matching the Hero/Top Picks layout. */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {searchTerm
                  ? `Results for "${searchTerm}"`
                  : "Popular offers ending soon"}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Refine using filters below"
                  : "Don't miss these from our sellers"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "item" : "items"}
              </span>
              <Link
                to="/products"
                className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
              >
                View all &rarr;
              </Link>
            </div>
          </div>

          {/* Filters, relocated from the old always-visible inline layout
              into a collapsible panel — all state/behavior preserved as-is. */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-expanded={filtersOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5h18M6 12h12M10 19h4"
                />
              </svg>
              Filters
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={`h-3.5 w-3.5 transition-transform ${
                  filtersOpen ? "rotate-180" : ""
                }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {filtersOpen && (
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        searchParams.delete("category");
                        setSearchParams(searchParams, { replace: true });
                      }}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        activeCategory === "all"
                          ? "bg-blue-700 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          searchParams.set("category", cat.id);
                          setSearchParams(searchParams, { replace: true });
                        }}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                          activeCategory === cat.id
                            ? "bg-blue-700 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
              </div>
            )}
          </div>

          {status === Status.LOADING && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <>
              {/* Horizontal scroll row on mobile, full responsive grid from sm up. */}
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 sm:hidden">
                {filteredProducts.map((pd) => (
                  <div key={pd.id} className="w-[65vw] flex-shrink-0 xs:w-[45vw]">
                    <Card data={pd} badge="Marketplace" showSoldBy />
                  </div>
                ))}
              </div>
              <div className="mt-8 hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-3 xl:grid-cols-5">
                {filteredProducts.map((pd) => (
                  <Card key={pd.id} data={pd} badge="Marketplace" showSoldBy />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <InspirationBand />

      <Footer />
    </div>
  );
};

export default Home;
