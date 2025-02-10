import LongProductCard from "./components/LongProductCard";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <div>
        <h1>Smartphones</h1>
        <div className="grid grid-cols-4 gap-5 mb-10">
          <ProductCard id="b6fcfbbc-9790-4feb-b9e4-fe81908de682" />
          <ProductCard id="bc226d93-5ef0-41db-bbf3-202ddd2c768a" />
          <ProductCard id="733f9dd6-ca90-4363-b441-f157c9685beb" />
          <ProductCard id="895925ae-a8f4-428d-b0c0-e1e1c34317bf" />
        </div>
        <h1>Long Product Card</h1>
        <div className="grid grid-cols-2 gap-5">
          <LongProductCard id="b6fcfbbc-9790-4feb-b9e4-fe81908de682" />
          <LongProductCard id="bc226d93-5ef0-41db-bbf3-202ddd2c768a" />
          <LongProductCard id="733f9dd6-ca90-4363-b441-f157c9685beb" />
          <LongProductCard id="895925ae-a8f4-428d-b0c0-e1e1c34317bf" />
        </div>
    </div>
  );
}
