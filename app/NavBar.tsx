import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { GrSearch } from "react-icons/gr";
import { IoBagOutline } from "react-icons/io5";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Separator } from "@/components/ui/separator";
import Search from "./Search";

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="grid grid-cols-3 items-center px-10 py-4 text-slate-200 bg-neutral-900">
        <Link href="/categories">Categories</Link>
      <div className="text-center">
        <Link href="/" className="font-semibold text-2xl">
          ECOMMER
        </Link>
      </div>
      <div className="justify-self-end flex items-center gap-4">
        {/* <Link href="/search">
          <GrSearch className="size-5" />
        </Link> */}
        <Search />
        <Link href="/cart">
          <IoBagOutline className="size-5" />
        </Link>
        <Separator orientation="vertical" className="h-4 ml-1 opacity-40" />
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="flex items-center gap-1 cursor-pointer">
                <p>{session.user!.name?.split(" ")[0]}</p>
                <FaChevronDown className="size-3" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="w-[80%] justify-self-center" />
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Your Orders</DropdownMenuItem>
              <DropdownMenuSeparator className="w-[80%] justify-self-center" />
              <DropdownMenuItem>
                <Link href="/api/auth/signout" className="w-full">
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!session && <Link href="api/auth/signin">Login</Link>}
      </div>
    </div>
  );
};

export default NavBar;
