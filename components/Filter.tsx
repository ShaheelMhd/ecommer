"use client";

import { Form, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";

const schema = z.object({
  brand: z.string().max(50),
});

const Filter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    router.push(`?brand=${data.brand}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
    form.reset();
  }

  return (
    <>
      <Popover>
        <PopoverTrigger className="hover:underline">Filters</PopoverTrigger>
        <PopoverContent className="mr-10">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Brand</Label>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="samsung">Samsung</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-5 w-full">
                  Apply
                </Button>
                <Button
                  className="mt-2 w-full"
                  variant="destructive"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              </form>
            </Form>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Filter;
