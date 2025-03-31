"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface Props {
  className?: string;
}

const ViewToggle = ({ className }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <ToggleGroup
      type="single"
      defaultValue={searchParams.get("view") || "grid"}
      className={`${className}`}
    >
      <ToggleGroupItem
        value="grid"
        size="sm"
        aria-label="Toggle grid view"
        onClick={() => updateSearchParams("view", "grid")}
      >
        <LuRectangleVertical className="h-2 w-2" />
        <p className="mr-1">Grid</p>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        size="sm"
        aria-label="Toggle list view"
        onClick={() => updateSearchParams("view", "list")}
      >
        <LuRectangleHorizontal className="ml-1 h-2 w-2" />
        <p className="mr-1">List</p>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
