"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ShopSortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

  const setSort = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sortOrder", value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">Sort by date added</p>
      <Select value={sortOrder} onValueChange={setSort}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
