import Card from "../../globals/components/card/Card";
import Navbar from "../../globals/components/navbar/Navbar";

const Home = () => {
  return (
    <>
      <div
        id="page-container"
        className="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
      >
        <Navbar />
        <main id="page-content" className="flex max-w-full flex-auto flex-col">
          <div className="bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
              <div className="space-y-2 py-2 text-center sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:text-left lg:py-0">
                <div className="grow">
                  <h1 className="mb-1 text-xl font-bold">Dashboard</h1>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Welcome
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      John
                    </a>
                    , everything seems great!
                  </h2>
                </div>
                <div className="flex flex-none items-center justify-center gap-2 rounded-sm px-2 py-3 sm:justify-end sm:bg-transparent sm:px-0">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-3 focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400/90"
                  >
                    <svg
                      className="hi-mini hi-plus inline-block size-5 opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    <span>New Project</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-64 text-gray-400 dark:border-gray-700 dark:bg-gray-800">
              Content (max width 1280px)
            </div>
          </div>
        </main>

        <footer
          id="page-footer"
          className="flex flex-none items-center bg-white dark:bg-gray-800"
        >
          <div className="container mx-auto flex flex-col px-4 text-center text-sm md:flex-row md:justify-between md:text-left lg:px-8 xl:max-w-7xl">
            <div className="pt-4 pb-1 md:pb-4">
              <a
                href="https://tailkit.com"
                className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tailkit
              </a>
              ©
            </div>
            <div className="inline-flex items-center justify-center pt-1 pb-4 md:pt-4">
              <span>Crafted with</span>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className="hi-solid hi-heart mx-1 inline-block size-4 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                by
                <a
                  href="https://pixelcave.com"
                  className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pixelcave
                </a>
              </span>
            </div>
          </div>
        </footer>
        <div className="flex">
          <h1>Top Products</h1>
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
};

export default Home;
