"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type User = {
  name: string | null;
  id: string;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserManagePage = () => {
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) throw new Error();
        setUser(await response.json());
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const userUpdateSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3).optional(),
    role: z.enum(["user", "admin"]),
  });

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
  });

  // to populate input fields with values
  // once the user data is finished fetching
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        username: user.username ?? undefined,
        role: user.role as "user" | "admin",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {
    try {
      const response = await fetch(`/api/users/update?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          role: values.role,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("User updated successfully");
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to update user");
    }
  }

  return (
    <div>
      <h1>Manage User: {user?.name}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter a username (optional)"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserManagePage;
