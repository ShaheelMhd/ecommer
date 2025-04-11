import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import AdminNavBar from "../AdminNavBar";
import AdminCard from "../AdminCard";
import { IoAddCircle } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { PiWrenchFill } from "react-icons/pi";
import { IoExitOutline } from "react-icons/io5";

const items = [
  { title: "Add Products", href: "/admin/products/add", Icon: IoAddCircle },
  { title: "Manage Products", href: "/admin/products/manage", Icon: PiWrenchFill },
  { title: "Manage Users", href: "/admin/users/manage", Icon: FaUsers },
  { title: "Quit", href: "/", Icon: IoExitOutline },
];

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
        <div className="grid grid-cols-4 gap-5">
          {items.map((item) => (
            <AdminCard title={item.title} href={item.href} Icon={item.Icon} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
