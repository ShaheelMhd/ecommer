import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import LoginForm from "../SignInForm";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign In - Ecommer",
    description:
      "Log in to explore thousands of gadgets and more with Ecommer.",
  };
}

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 w-fit">
      <LoginForm />
      <Separator className="w-[80%]" />
      <Button className="p-6 py-7 text-md w-full">
        <FaGoogle className="mr-1" />
        Continue with Google
      </Button>
    </div>
  );
};

export default SignInPage;
