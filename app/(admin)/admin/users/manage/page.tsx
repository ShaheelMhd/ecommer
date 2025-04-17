import DeleteUserButton from "@/app/(admin)/components/DeleteUserButton";
import ManageUserButton from "@/app/(admin)/components/ManageUserButton";
import { authOptions } from "@/app/api/auth/authOptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Manage Users - Ecommer",
  description: "Manage users on the platform.",
};

const UsersManagePage = async () => {
  const session = await getServerSession(authOptions);
  const sessionUserEmail = session?.user?.email;

  const users = await prisma.user.findMany({ orderBy: { role: "asc" } });

  return (
    <div>
      <h1>Manage Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.email != sessionUserEmail && (
                  <span className="inline-flex gap-3">
                    <ManageUserButton userId={user.id} />
                    <DeleteUserButton userId={user.id} />
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagePage;
