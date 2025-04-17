import { ReactNode } from "react";
import AdminNavBar from "./components/AdminNavBar";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <AdminNavBar />
      <main className="sm:px-3 md:px-7 p-10">{children}</main>
    </>
  );
}
