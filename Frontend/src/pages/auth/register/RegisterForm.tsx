import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import type { UserDataType } from "../types.ts";

interface Props {
  onSubmit: (data: UserDataType) => void;
  submitting: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [subscribeOffers, setSubscribeOffers] = useState(false);

  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(true);

  const emailIsValid = email === "" || EMAIL_RE.test(email);
  const showEmailError = emailTouched && email !== "" && !emailIsValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!EMAIL_RE.test(email)) return;

    // Username isn't collected as a separate field in this layout — the
    // backend requires one, so derive it from the email local-part.
    const username = email.split("@")[0];

    onSubmit({
      email,
      password,
      username,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });
  };

  const inputClasses =
    "block w-full rounded-lg border border-gray-300 px-4 py-2.5 leading-6 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/30";
  const inputErrorClasses =
    "block w-full rounded-lg border border-red-400 px-4 py-2.5 leading-6 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring focus:ring-red-500/30";
  const labelClasses = "text-sm font-medium text-gray-700";
  const sectionHeadingClasses = "text-lg font-bold text-gray-900";

  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Top utility bar */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8 xl:max-w-7xl">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600"
          >
            Online Karobar
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600">
              Help
            </a>
            <Link to="/login" className="hover:text-blue-600">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-10 lg:px-8">
        {/* Heading */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register</h1>
          <p className="mt-2 text-sm text-gray-500">
            Let's get you set up with your account. We just need a few
            details.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Account details */}
          <section className="space-y-4">
            <h2 className={sectionHeadingClasses}>Account details</h2>

            <div className="space-y-1">
              <label htmlFor="email" className={labelClasses}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                onBlur={() => setEmailTouched(true)}
                className={showEmailError ? inputErrorClasses : inputClasses}
              />
              {showEmailError && (
                <p className="text-xs font-medium text-red-600">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-11`}
                  required
                  minLength={1}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.29 10.29 0 003.135-3.744.75.75 0 000-.667C17.766 6.542 14.522 4 10.75 4a9.6 9.6 0 00-4.16.94L3.28 2.22zM7.53 6.47l1.634 1.633a3 3 0 013.733 3.733l1.634 1.634a4.5 4.5 0 00-6.999-6.998z" />
                      <path d="M10.75 16c-3.771 0-7.016-2.542-7.965-6.036a.75.75 0 010-.667c.375-1.375 1.15-2.594 2.192-3.567l1.079 1.079A6.75 6.75 0 004.34 9.63a8.1 8.1 0 007.36 4.87c.616 0 1.216-.068 1.79-.196l1.181 1.18A9.53 9.53 0 0110.75 16z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path
                        fillRule="evenodd"
                        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Subscribe to offers */}
          <section className="space-y-3 rounded-xl bg-blue-50 p-5">
            <h2 className={sectionHeadingClasses}>
              Subscribe to offers and updates
            </h2>
            <p className="text-sm text-gray-600">
              Be the first to hear about new deals, seasonal offers and
              product drops. You can unsubscribe at any time.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subscribeOffers}
                onChange={(e) => setSubscribeOffers(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-500/30"
              />
              <span className="text-sm text-gray-700">
                Yes, subscribe me to offers and updates
              </span>
            </label>
          </section>

          {/* Personal details */}
          <section className="space-y-4">
            <h2 className={sectionHeadingClasses}>Personal details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[8rem_1fr]">
              <div className="space-y-1">
                <label htmlFor="title" className={labelClasses}>
                  Title
                </label>
                <select
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClasses}
                >
                  <option value="">--</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Mx">Mx</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="firstName" className={labelClasses}>
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className={labelClasses}>
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="mobile" className={labelClasses}>
                Mobile number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98XXXXXXXX"
                className={inputClasses}
              />
              <p className="text-xs text-gray-500">
                We'll only use this for order updates and delivery.
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="address" className={labelClasses}>
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, postal code"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setShowAddressDetails((v) => !v)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {showAddressDetails
                  ? "Hide address details"
                  : "Add address manually"}
              </button>

              {showAddressDetails && (
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label htmlFor="street" className={labelClasses}>
                      Street
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="city" className={labelClasses}>
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="postalCode" className={labelClasses}>
                      Postal code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}
              <p className="pt-1 text-xs text-gray-500">
                You'll also be asked to confirm your delivery address at
                checkout.
              </p>
            </div>
          </section>

          {/* Marketing preferences */}
          <section className="space-y-3">
            <h2 className={sectionHeadingClasses}>Marketing preferences</h2>
            <p className="text-sm text-gray-500">
              Tell us how you'd like to hear from us about offers, new
              arrivals and account updates.
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-500/30"
                />
                <span className="text-sm text-gray-700">
                  Email me about offers and updates
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={smsUpdates}
                  onChange={(e) => setSmsUpdates(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-500/30"
                />
                <span className="text-sm text-gray-700">
                  Text me about offers and updates
                </span>
              </label>
            </div>
          </section>

          {/* Submit */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold leading-6 text-white transition hover:bg-blue-700 focus:ring focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
            <p className="text-center text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
