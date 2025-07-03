import { getRequest } from "../../lib/strapi";
import { Category } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  const data = await getRequest("categories?populate=image");
  return data?.data || [];
}
