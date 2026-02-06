import { environment } from "../../../environments/environment";

export function resolveImageUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${environment.apiBaseUrl}${url}`;
}
