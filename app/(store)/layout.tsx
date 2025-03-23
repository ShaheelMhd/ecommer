import React, { ReactNode } from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";

interface Props {
  children: ReactNode;
}

const StoreLayout = ({ children }: Props) => {
  return (
    <>
      <NavBar />
      <div className="p-10">{children}</div>
      <Footer />
    </>
  );
};

export default StoreLayout;
