import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
