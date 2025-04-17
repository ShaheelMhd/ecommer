import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Your Profile - Ecommer",
  description: "Manage your profile.",
};

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: { email: session!.user?.email },
  });

  return (
    <>
      <h1 className="mb-5">Your Profile</h1>
      <div className="flex justify-center mb-3">
        <Image
          src={user!.image!}
          alt="User's profile Picture"
          width={100}
          height={100}
          className="rounded-full max-sm:mb-3"
        />
      </div>
      <p>Name: {user?.name}</p>
    </>
  );
};

export default ProfilePage;
