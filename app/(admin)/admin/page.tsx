import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { Metadata } from "next/types";
import { FaUsers } from "react-icons/fa6";
import { IoAddCircle, IoExitOutline } from "react-icons/io5";
import { PiWrenchFill } from "react-icons/pi";
import AdminCard from "../components/AdminCard";

const items = [
  { title: "Add Products", href: "/admin/products/add", Icon: IoAddCircle },
  {
    title: "Manage Products",
    href: "/admin/products/manage",
    Icon: PiWrenchFill,
  },
  { title: "Manage Users", href: "/admin/users/manage", Icon: FaUsers },
  { title: "Quit", href: "/", Icon: IoExitOutline },
];

export const metadata: Metadata = {
  title: "Admin Panel - Ecommer",
  description: "Add and manage products, users and more.",
};

const AdminPage = async () => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  if (user?.role !== "admin")
    return (
      <div className="flex justify-center items-center h-dvh">
        <h1>Access Unauthorized</h1>
      </div>
    );

  return (
    <>
      <div>
        <h1>Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
        <div
          className="grid sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-1 gap-3"
        >
          {items.map((item) => (
            <AdminCard
              key={item.title}
              title={item.title}
              href={item.href}
              Icon={item.Icon}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
