import { useEffect } from "react";
import Card from "../../globals/components/card/Card.tsx";
import Footer from "../../globals/components/footer/Footer.tsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchProducts } from "../../store/productSlice.ts";
import Hero from "./components/Hero.tsx";

const Home = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  console.log(product);
  return (
    <div className="m-0 p-0 box-border">
      <Hero />
      <div className="flex flex-col items-center  text-gray-600 dark:bg-gray-800 ">
        <h1 className="text-4xl font-bold text-center  text-gray-800 ">
          Top Products
        </h1>
        <div className="flex flex-wrap justify-center gap-6">
          {product.length > 0 &&
            product.map((pd) => {
              return <Card key={pd.id} data={pd} />;
            })}
        </div>
      </div>
      <div className="w-full  text-4xl font-bold text-center text-grey-800">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
