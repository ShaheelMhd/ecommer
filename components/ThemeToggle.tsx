"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Switch } from "./ui/switch";

const schema = z.object({
  darkMode: z.boolean(),
});

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      darkMode: theme === "dark" ? true : false,
    },
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="darkMode"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <p className="text-sm ml-2.5">Dark mode</p>
              <div>
                <FormControl>
                  <Switch
                    className="mr-2.5"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setTheme(checked ? "dark" : "light");
                    }}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ThemeToggle;
