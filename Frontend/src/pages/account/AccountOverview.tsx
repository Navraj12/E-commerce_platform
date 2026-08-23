import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../../globals/components/navbar/Navbar.tsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchMyOrders } from "../../store/checkoutSlice.ts";

const SECTION_TABS = [
  { id: "details", label: "Details and preferences" },
  { id: "orders", label: "Orders" },
  { id: "security", label: "Security and password" },
];

const CircularProgress = ({ percent }: { percent: number }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="shrink-0">
      <circle
        cx="55"
        cy="55"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      <circle
        cx="55"
        cy="55"
        r={radius}
        fill="none"
        stroke="#2563eb"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 55 55)"
      />
      <text
        x="55"
        y="60"
        textAnchor="middle"
        className="fill-gray-900 text-xl font-bold"
        style={{ fontSize: "20px", fontWeight: 700 }}
      >
        {percent}%
      </text>
    </svg>
  );
};

const AccountOverview = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myOrders } = useAppSelector((state) => state.orders);
  const token = localStorage.getItem("token");

  const [showSetupSteps, setShowSetupSteps] = useState(false);
  const [accountSearch, setAccountSearch] = useState("");

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (!token && !user?.token) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user?.firstName?.trim() || user?.username || "there";

  const hasOrders = myOrders.length > 0;
  const mostRecentOrder = hasOrders
    ? [...myOrders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;

  // Account setup steps, computed from real user/order data only.
  const setupSteps = [
    { label: "Email on file", done: Boolean(user?.email) },
    { label: "Password set", done: true },
    {
      label: "Name provided",
      done: Boolean(user?.firstName?.trim() && user?.lastName?.trim()),
    },
    { label: "Placed at least one order", done: hasOrders },
  ];
  const completedCount = setupSteps.filter((s) => s.done).length;
  const percent = Math.round((completedCount / setupSteps.length) * 100);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar />

      {/* Secondary page nav */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex flex-wrap gap-2">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={accountSearch}
              onChange={(e) => setAccountSearch(e.target.value)}
              placeholder="Search account"
              title="UI only — does not filter anything yet"
              className="w-56 rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 pb-12">
        <div className="container mx-auto px-4 py-6 sm:px-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Hello {displayName}, here&apos;s your account overview.
          </h1>

          {/* Account setup progress */}
          <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-6">
              <CircularProgress percent={percent} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {percent === 100
                    ? "Account setup complete"
                    : "Account setup incomplete"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {percent === 100
                    ? "You've completed all the steps to set up your account."
                    : "Finish setting up your account to get the most out of it."}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  {completedCount} of {setupSteps.length} completed
                </p>
                <button
                  type="button"
                  onClick={() => setShowSetupSteps((v) => !v)}
                  className="mt-3 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  {showSetupSteps ? "Hide account setup" : "Show account setup"}
                </button>
              </div>
            </div>

            {showSetupSteps && (
              <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100 pt-4">
                {setupSteps.map((step) => (
                  <li
                    key={step.label}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="text-gray-700">{step.label}</span>
                    <span
                      className={
                        step.done
                          ? "font-medium text-green-600"
                          : "font-medium text-gray-400"
                      }
                    >
                      {step.done ? "Completed" : "Not completed"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Orders card */}
            <div
              id="orders"
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm scroll-mt-24"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Orders
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/myorders"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      My Orders
                    </Link>
                  </li>
                </ul>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Order status
                    </h3>
                    <Link
                      to="/myorders"
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  {mostRecentOrder ? (
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{mostRecentOrder.orderStatus}</p>
                      <p className="text-gray-500">
                        {new Date(
                          mostRecentOrder.createdAt
                        ).toLocaleDateString()}
                      </p>
                      <p className="mt-1 font-medium text-gray-900">
                        Rs. {mostRecentOrder.totalAmount}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p>
                        You haven&apos;t ordered anything yet — Time to fill
                        your basket?
                      </p>
                      <Link
                        to="/"
                        className="mt-2 inline-block font-medium text-blue-600 hover:underline"
                      >
                        Place an order now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details and preferences card */}
            <div
              id="details"
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm scroll-mt-24"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Details and preferences
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#details"
                    title="No dedicated personal-details edit page exists yet"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Personal details
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="UI only — no backend persistence"
                    className="font-medium text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Marketing preferences
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="UI only — no backend persistence"
                    className="font-medium text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Privacy preferences
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="UI only — no backend persistence"
                    className="font-medium text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Request saved data
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="UI only — not wired to any account-deletion endpoint"
                    className="font-medium text-red-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Close account
                  </a>
                </li>
              </ul>
            </div>

            {/* Security and password card */}
            <div
              id="security"
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm scroll-mt-24 lg:col-span-2"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Security and password
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/forgot-password"
                    title="Reuses the existing forgot-password/reset-token flow"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Change password
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    title="UI only — no phone/mobile field exists on the user account"
                    className="font-medium text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Update mobile number
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountOverview;
