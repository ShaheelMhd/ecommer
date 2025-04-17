import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Link from "next/link";
import GoogleSignIn from "./GoogleSignIn";
import LoginForm from "./SignInForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login - Ecommer",
    description: "Login to explore thousands of gadgets with Ecommer.",
  };
}

const SignInPage = () => {
  return (
    <div
      className="sm:w-[85%] md:w-[65%] lg:w-[55%] xl:w-[40%]
    flex flex-col items-center justify-center"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 w-full">
          <LoginForm />
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link className=" text-blue-400" href="/register">
              Register now.
            </Link>
          </p>
          <Separator className="w-[80%]" />
          <GoogleSignIn />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
