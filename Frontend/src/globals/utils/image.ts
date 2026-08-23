const UPLOADS_BASE_URL = "http://localhost:5000/uploads";

export function getProductImageUrl(productImageUrl?: string | null): string {
  if (!productImageUrl) return "/placeholder.png";
  if (/^https?:\/\//i.test(productImageUrl)) return productImageUrl;
  return `${UPLOADS_BASE_URL}/${productImageUrl}`;
}
