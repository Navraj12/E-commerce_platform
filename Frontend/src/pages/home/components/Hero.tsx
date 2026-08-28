import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../globals/components/navbar/Navbar.tsx";
import type { Product } from "../../../globals/types/productTypes.ts";
import { getProductImageUrl } from "../../../globals/utils/image.ts";
import { fetchCategories } from "../../../store/categorySlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";

interface PromoCard {
  categoryId?: string;
  badge?: string;
  headline: string;
  copy: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const Hero = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { product } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Group products by category so promo cards can be built from real data.
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    product.forEach((p) => {
      const list = map.get(p.categoryId) ?? [];
      list.push(p);
      map.set(p.categoryId, list);
    });
    return map;
  }, [product]);

  // Pick up to 3 categories that actually have products, most-stocked first.
  const topCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        cat,
        items: productsByCategory.get(cat.id) ?? [],
      }))
      .filter((entry) => entry.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length)
      .slice(0, 3);
  }, [categories, productsByCategory]);

  const promoCards: PromoCard[] = useMemo(() => {
    return topCategories.map((entry, idx) => {
      const bestProduct = entry.items[0];
      if (idx === 0) {
        // Card 1 folds in the original "Welcome to Online Karobar" copy and
        // keeps the "Shop Now" CTA (originally anchored to #top-products).
        return {
          categoryId: entry.cat.id,
          badge: "New in",
          headline: `Welcome to Online Karobar - ${entry.cat.categoryName}`,
          copy: "Everyday essentials, electronics and more — delivered to your door.",
          ctaText: "Shop Now",
          ctaLink: `/?category=${encodeURIComponent(entry.cat.id)}`,
          image: getProductImageUrl(bestProduct?.productImageUrl),
        };
      }
      return {
        categoryId: entry.cat.id,
        badge:
          entry.items.length > 1 ? `${entry.items.length}+ picks` : undefined,
        headline: entry.cat.categoryName,
        copy: `Top-rated ${entry.cat.categoryName.toLowerCase()} picked for this season, in stock and ready to ship.`,
        ctaText: `Shop ${entry.cat.categoryName}`,
        ctaLink: `/?category=${encodeURIComponent(entry.cat.id)}`,
        image: getProductImageUrl(bestProduct?.productImageUrl),
      };
    });
  }, [topCategories]);

  // Fill in a "Track your order" fallback card if fewer than 3 categories exist.
  while (promoCards.length < 3) {
    promoCards.push({
      badge: undefined,
      headline: "Track your orders",
      copy: "Follow every delivery in real time, from checkout to your doorstep.",
      ctaText: "Track Orders",
      ctaLink: "/myorders",
      image: "/placeholder.png",
    });
  }

  // Strip thumbnails: a handful of real products for the scrolling row.
  const stripProducts = product.slice(0, 10);

  const heading =
    topCategories.length > 0
      ? `All you need this season — from ${topCategories
          .map((e) => e.cat.categoryName)
          .join(", ")}`
      : "All you need this season";

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 dark:text-gray-100">
      <Navbar />

      <div className="container relative mx-auto px-4 py-10 lg:px-8 lg:py-14 xl:max-w-7xl">
        {/* Section heading */}
        <h1 className="mb-6 text-left text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
          {heading}
        </h1>

        {/* 3-column promo grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {promoCards.map((card, idx) => (
            <div
              key={card.categoryId ?? idx}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-gray-800"
            >
              {/* Landscape image with overlay headline */}
              <Link
                to={card.ctaLink}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={card.image}
                  alt={card.headline}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {card.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                    {card.badge}
                  </span>
                )}
                <span className="absolute inset-x-3 bottom-3 text-lg font-bold leading-tight text-white drop-shadow">
                  {card.headline}
                </span>
              </Link>

              {/* Supporting copy + CTA, below the image */}
              <div className="flex flex-1 flex-col items-start gap-3 bg-white p-4 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.copy}
                </p>
                <Link
                  to={card.ctaLink}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {card.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dark banner strip: keeps "Track Orders" CTA and shows live product thumbnails */}
        <div className="mt-6 flex items-center gap-4 rounded-xl bg-blue-900 px-4 py-3 text-white">
          <div className="flex-none">
            <p className="text-sm font-semibold">
              Free delivery on your first order
            </p>
            <button
              onClick={() => navigate("/myorders")}
              className="text-xs font-medium text-blue-200 underline underline-offset-2 hover:text-white"
            >
              Track Orders
            </button>
          </div>

          <div className="flex flex-1 flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide">
            {stripProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                title={p.productName}
                className="flex-none overflow-hidden rounded-lg border border-white/20 bg-white/10 transition hover:border-white/60"
              >
                <img
                  src={getProductImageUrl(p.productImageUrl)}
                  alt={p.productName}
                  className="h-12 w-12 object-cover"
                />
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Scroll thumbnails"
            onClick={(e) => {
              const row = e.currentTarget
                .previousElementSibling as HTMLElement | null;
              row?.scrollBy({ left: 200, behavior: "smooth" });
            }}
            className="flex-none rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.148 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
