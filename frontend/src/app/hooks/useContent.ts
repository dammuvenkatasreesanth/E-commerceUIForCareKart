import { useQuery } from "@tanstack/react-query";
import * as contentApi from "../lib/api/endpoints/content";

export function useContentPage(slug: string) {
  return useQuery({
    queryKey: ["content-page", slug],
    queryFn: () => contentApi.getContentPage(slug),
    staleTime: 5 * 60_000,
  });
}
