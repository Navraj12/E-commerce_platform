import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../../store/categorySlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";

// Trust-strip items, relocated here from the mid-page strip in Home.tsx.
// The first 3 populate the "We're here to help" cards; the 4th ("Easy
// Tracking") is folded into the "Even more to explore" section below as
// the Order Tracking link.
const helpItems = [
  {
    icon: "🚚",
    title: "Free Shipping",
    desc: "On all orders, no minimum spend required.",
    linkText: "See delivery details",
    to: "#",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    desc: "Your payment and personal data are protected.",
    linkText: "Learn about security",
    to: "#",
  },
  {
    icon: "💵",
    title: "Cash on Delivery",
    desc: "Pay conveniently when your order arrives.",
    linkText: "Payment options",
    to: "#",
  },
];

// Invented but realistic e-commerce service links. Routes that exist in
// the app (/myorders, /wishlist) are linked for real; the rest use "#"
// placeholders since there's no dedicated page for them yet.
const exploreItems = [
  {
    icon: "📦",
    title: "Order Tracking",
    desc: "Real-time updates on every order, start to finish.",
    linkText: "Track an order",
    to: "/myorders",
  },
  {
    icon: "❤️",
    title: "Wishlist",
    desc: "Save items you love and shop them later.",
    linkText: "View wishlist",
    to: "/wishlist",
  },
  {
    icon: "💬",
    title: "Customer Support",
    desc: "Get help with orders, returns and accounts.",
    linkText: "Contact support",
    to: "#",
  },
  {
    icon: "🎁",
    title: "Gift Cards",
    desc: "Buy a gift card for friends and family.",
    linkText: "Explore gift cards",
    to: "#",
  },
];

// Standard 4-column footer nav. Links to real routes where they exist;
// everything else is a "#" placeholder pending a dedicated page.
const footerColumns: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Help",
    links: [
      { label: "Help Centre", to: "#" },
      { label: "Track My Order", to: "/myorders" },
      { label: "Delivery Information", to: "#" },
      { label: "Returns & Refunds", to: "#" },
      { label: "Contact Us", to: "#" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Us", to: "#" },
      { label: "Careers", to: "#" },
      { label: "Store Locator", to: "#" },
      { label: "Sustainability", to: "#" },
      { label: "Press", to: "#" },
    ],
  },
  {
    heading: "Ways to Save",
    links: [
      { label: "Offers & Deals", to: "/" },
      { label: "Gift Cards", to: "#" },
      { label: "Coupons", to: "#" },
      { label: "Student Discount", to: "#" },
      { label: "Loyalty Rewards", to: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "My Account", to: "/login" },
      { label: "My Orders", to: "/myorders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Shopping Cart", to: "/cart" },
      { label: "FAQs", to: "#" },
    ],
  },
];

// Placeholder social icons — non-functional "#" links per spec.
const socialLinks = [
  { label: "Facebook", path: "M22 12a10 10 0 10-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H16l-.4 2.9h-2.1v7A10 10 0 0022 12z" },
  { label: "Twitter", path: "M22 5.9c-.7.3-1.5.6-2.4.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.8A11.7 11.7 0 013 4.9a4.2 4.2 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.7 3.3 4a4 4 0 01-1.9.1 4.1 4.1 0 003.9 2.9A8.3 8.3 0 012 18.6a11.6 11.6 0 006.3 1.9c7.5 0 11.7-6.4 11.7-11.9v-.5c.8-.6 1.5-1.3 2-2.2z" },
  { label: "Instagram", path: "M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5a5 5 0 011.8 1.2 5 5 0 011.2 1.8c.3.7.5 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5a5 5 0 01-1.2 1.8 5 5 0 01-1.8 1.2c-.7.3-1.4.5-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5a5 5 0 01-1.8-1.2 5 5 0 01-1.2-1.8c-.3-.7-.5-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5a5 5 0 011.2-1.8A5 5 0 015.6 2.6c.7-.3 1.4-.5 2.5-.5C9.1 2 9.5 2 12 2zm0 1.8c-2.6 0-3 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.7.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.7a2.7 2.7 0 00-.7-1 2.7 2.7 0 00-1-.7c-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1zm0 3.5a4.7 4.7 0 110 9.4 4.7 4.7 0 010-9.4zm0 1.8a2.9 2.9 0 100 5.8 2.9 2.9 0 000-5.8zm5.9-2a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" },
  { label: "YouTube", path: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.6 15.5V8.5l6.3 3.5-6.3 3.5z" },
];

const Footer = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // "Shop by brand" reuses real category data (icon + name) since this
  // store has no partner/brand data — placeholder stand-in per the spec.
  const brandSlots = categories.slice(0, 9);

  return (
    <footer id="page-footer" className="bg-white dark:bg-gray-900">
      {/* 1. Shop by brand */}
      {brandSlots.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-10 dark:border-gray-800 lg:px-8">
          <div className="container mx-auto xl:max-w-7xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Shop by brand
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A stand-in for partner/brand logos, built from our own product
              categories.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              {brandSlots.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/?category=${cat.id}`}
                  title={cat.categoryName}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                    {cat.categoryIcon || cat.categoryName?.charAt(0).toUpperCase() || "🏷️"}
                  </span>
                  <span className="max-w-[5rem] truncate text-xs font-medium text-gray-600 dark:text-gray-300">
                    {cat.categoryName}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. We're here to help */}
      <div className="bg-gray-50 px-4 py-12 dark:bg-gray-950 lg:px-8">
        <div className="container mx-auto xl:max-w-7xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            We're here to help
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {helpItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
                <a
                  href={item.to}
                  className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  {item.linkText} &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Even more to explore */}
      <div className="px-4 py-12 dark:bg-gray-900 lg:px-8">
        <div className="container mx-auto xl:max-w-7xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Even more to explore
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exploreItems.map((item) => (
              <div key={item.title}>
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-2 font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
                <Link
                  to={item.to}
                  className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  {item.linkText} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Dense legal/terms fine print — generic placeholder copy */}
      <div className="bg-gray-100 px-4 py-8 text-xs leading-relaxed text-gray-500 dark:bg-gray-950 dark:text-gray-400 lg:px-8">
        <div className="container mx-auto space-y-1 xl:max-w-7xl">
          <p>
            The following information is placeholder legal copy and should be
            reviewed and replaced with real terms before this site goes live.
          </p>
          <p>
            1. Prices and availability of products are subject to change
            without notice. We reserve the right to limit quantities
            purchased per customer.
          </p>
          <p>
            2. Delivery times are estimates only and may vary based on
            location, carrier performance and product availability.
          </p>
          <p>
            3. Offers, discounts and promotional codes cannot be combined
            unless otherwise stated and may be withdrawn at any time.
          </p>
          <p>
            4. Cash on Delivery is available only in select locations and may
            be subject to additional verification.
          </p>
          <p>
            5. Product images are for illustrative purposes only; actual
            packaging and contents may vary.
          </p>
          <p>
            6. All trademarks, logos and brand names displayed are the
            property of their respective owners.
          </p>
          <p>
            7. By using this site you agree to our Terms & Conditions and
            Privacy Policy. Terms apply.
          </p>
        </div>
      </div>

      {/* 5. Standard footer nav */}
      <div className="border-t border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-900 lg:px-8">
        <div className="container mx-auto xl:max-w-7xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-500 hover:text-blue-600 hover:underline dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social icons — non-functional placeholders */}
          <div className="mt-10 flex items-center justify-center gap-4 border-t border-gray-100 pt-8 dark:border-gray-800">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Original attribution, preserved verbatim */}
          <div className="mt-8 flex flex-col items-center justify-center gap-1 text-center text-sm text-gray-500 dark:text-gray-400 md:flex-row md:gap-2">
            <div>
              <a
                href="https://github.com/Navraj12"
                className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Navraj Awasthi
              </a>
              ©
            </div>
            <div className="inline-flex items-center justify-center">
              <span>Crafted with</span>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="mx-1 inline-block h-4 w-4 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                by{" "}
                <a
                  href="https://github.com/Navraj12"
                  className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NTR
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
