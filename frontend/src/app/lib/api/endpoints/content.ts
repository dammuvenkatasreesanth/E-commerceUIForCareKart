import { api } from "../client";

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  bodyHtml: string;
  isPublished: boolean;
}

export function getContentPage(slug: string): Promise<ContentPage> {
  return api.get(`/content/pages/${slug}`);
}
