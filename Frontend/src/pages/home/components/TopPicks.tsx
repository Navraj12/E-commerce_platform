import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../../../globals/utils/image.ts";
import type { Product } from "../../../globals/types/productTypes.ts";

interface TopPickCard {
  product: Product;
  headline: string;
  copy: string;
}

interface TopPicksProps {
  products: Product[];
}

// Build a benefit-framed headline from a product's real data (rating,
// category, price) instead of hardcoded fictional copy.
function buildHeadline(product: Product): string {
  const rating = product.averageRating ?? 0;
  if (rating >= 4) {
    return `Customer favourite: ${product.productName}`;
  }
  if (product.reviewCount && product.reviewCount > 0) {
    return `Highly rated ${product.productName}`;
  }
  return `Great value on ${product.productName}`;
}

function buildCopy(product: Product): string {
  const category = product.Category?.categoryName;
  const price = `Rs. ${product.productPrice}`;
  if (category) {
    return `${category} pick, now just ${price}.`;
  }
  return `In stock now for ${price}.`;
}

const TopPicks = ({ products }: TopPicksProps) => {
  const cards: TopPickCard[] = useMemo(() => {
    const featured = products.filter((p) => p.isFeatured);
    const featuredIds = new Set(featured.map((p) => p.id));

    // Fallback: fill remaining slots with the best top-rated / most-reviewed
    // products so the section never renders empty or with placeholder cards.
    const fallback = products
      .filter((p) => !featuredIds.has(p.id))
      .slice()
      .sort((a, b) => {
        const ratingDiff = (b.averageRating ?? 0) - (a.averageRating ?? 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      });

    // De-duplicate by id as a final safety net: guarantees all 4 slots are
    // always distinct products even if the source list itself contains a
    // repeated product (e.g. duplicate API rows).
    const seen = new Set<string>();
    const picked: Product[] = [];
    for (const p of [...featured, ...fallback]) {
      if (picked.length >= 4) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
    }

    return picked.map((product) => ({
      product,
      headline: buildHeadline(product),
      copy: buildCopy(product),
    }));
  }, [products]);

  if (cards.length === 0) return null;

  return (
    <div className="bg-white px-4 py-10 dark:bg-gray-900 lg:px-8">
      <div className="container mx-auto xl:max-w-7xl">
        <h2 className="mb-6 text-left text-2xl font-bold text-gray-900 dark:text-white">
          Top picks for you this week
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ product, headline, copy }) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={getProductImageUrl(product.productImageUrl)}
                  alt={product.productName}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-white">
                  {headline}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {copy}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Shop top picks
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
