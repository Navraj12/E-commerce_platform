import { useEffect } from "react";
import Card from "../../globals/components/card/Card";
import Footer from "../../globals/components/footer/Footer";
import Navbar from "../../globals/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";
import Hero from "./components/Hero";

const Home = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <div
        id="page-container"
        className="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
      >
        <Navbar />
        <Hero />

        <div className="flex flex-col items-center mt-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            Top Products
          </h1>
          <div className="flex flex-wrap justify center gap-6">
            {product.length > 0 &&
              product.map((pd) => {
                return <Card key={pd.id} data={pd} />;
              })}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
