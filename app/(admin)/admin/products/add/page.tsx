import { Metadata } from "next/types";
import AddProductForm from "./AddProductForm";

export const metadata: Metadata = {
  title: "Add Product - Ecommer",
  description: "Add a new product to the store.",
};

const ProductAddPage = () => {
  return (
    <>
      <h1>Add a Product</h1>
      <AddProductForm />
    </>
  );
};

export default ProductAddPage;
