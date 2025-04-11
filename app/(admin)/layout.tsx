import { ReactNode } from "react";
import AdminNavBar from "./components/AdminNavBar";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <AdminNavBar />
      <main className="p-10">{children}</main>
    </>
  );
}
