import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { getProductImageUrl } from "../../../globals/utils/image.ts";
import { fetchCategories } from "../../../store/categorySlice.ts";
import type { Product } from "../../../globals/types/productTypes.ts";

interface InspirationCard {
  categoryId: string;
  ribbon: string;
  headline: string;
  copy: string;
  ctaLink: string;
  image: string;
}

const InspirationBand = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Group products by category so cards can be built from real data.
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    product.forEach((p) => {
      const list = map.get(p.categoryId) ?? [];
      list.push(p);
      map.set(p.categoryId, list);
    });
    return map;
  }, [product]);

  // Same ranking Hero uses (most-stocked first), but this section takes the
  // NEXT 3 categories (indices 3-5) instead of the top 3, so it never
  // repeats what Hero already shows.
  const nextCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        cat,
        items: productsByCategory.get(cat.id) ?? [],
      }))
      .filter((entry) => entry.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length)
      .slice(3, 6);
  }, [categories, productsByCategory]);

  const inspirationCards: InspirationCard[] = useMemo(() => {
    return nextCategories.map((entry) => {
      const bestProduct = entry.items[0];
      // Prefer a real discount if any product in the category has one.
      const discounted = entry.items.find(
        (p) => (p.discountPercent ?? 0) > 0
      );
      const ribbon = discounted
        ? `Up to ${discounted.discountPercent}% off`
        : "New season picks";

      return {
        categoryId: entry.cat.id,
        ribbon,
        headline: `Inspired by ${entry.cat.categoryName}`,
        copy: `Fresh picks from our sellers in ${entry.cat.categoryName.toLowerCase()}, curated for you.`,
        ctaLink: `/?category=${encodeURIComponent(entry.cat.id)}`,
        image: getProductImageUrl(bestProduct?.productImageUrl),
      };
    });
  }, [nextCategories]);

  // Graceful fallback: if there aren't at least 3 categories with stock,
  // skip rendering this section rather than showing broken/empty cards.
  if (inspirationCards.length < 3) {
    return null;
  }

  return (
    <div className="bg-white px-4 py-12 text-gray-600 dark:bg-gray-900 lg:px-8">
      <div className="container mx-auto xl:max-w-7xl">
        <h2 className="mb-6 text-left text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
          Inspiration from our sellers
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {inspirationCards.map((card) => (
            <div
              key={card.categoryId}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-gray-800"
            >
              {/* Full-bleed image with ribbon overlay only (no headline overlay) */}
              <Link
                to={card.ctaLink}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={card.image}
                  alt={card.headline}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                  {card.ribbon}
                </span>
              </Link>

              {/* Headline, copy and CTA below the image */}
              <div className="flex flex-1 flex-col items-start gap-2 bg-white p-4 dark:bg-gray-900">
                <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                  {card.headline}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.copy}
                </p>
                <Link
                  to={card.ctaLink}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Shop and save &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationBand;
