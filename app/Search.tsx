"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GrSearch } from "react-icons/gr";
import { z } from "zod";

const formSchema = z.object({
  search: z.string().max(100),
});

const Search = () => {
  const [searchBar, setSearchBar] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    window.location.href = `/search/${values.search.split(" ").join("-")}`;
  }

  return (
    <div>
      {!searchBar ? (
        <GrSearch className="size-5" onClick={() => setSearchBar(true)} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <span className="flex items-center gap-2 h-8">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Search"
                    className="dark h-8 w-60"
                    {...field}
                  />
                )}
              />
              <Button variant="secondary" className="h-8" type="submit">
                <GrSearch className="size-5" />
              </Button>
            </span>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Search;
