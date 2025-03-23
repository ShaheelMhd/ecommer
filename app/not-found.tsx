import React from "react";
import NavBar from "./NavBar";

const ProductNotFoundPage = () => {
  return (
    <>
      <NavBar />
      <div className="flex align-center justify-center full-screen-height">
        <p className="text-2xl my-auto">Page not found!</p>
      </div>
    </>
  );
};

export default ProductNotFoundPage;
