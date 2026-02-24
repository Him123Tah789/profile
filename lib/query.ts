export function parseListQuery(url: string) {
  const params = new URL(url).searchParams;
  const page = Number(params.get("page") || "1");
  const limit = Math.min(Number(params.get("limit") || "10"), 50);
  const q = params.get("q")?.trim() || "";
  const sort = params.get("sort") || "createdAt:desc";
  const [sortField, sortDir] = sort.split(":");

  return {
    page: Number.isNaN(page) ? 1 : Math.max(1, page),
    limit: Number.isNaN(limit) ? 10 : Math.max(1, limit),
    q,
    skip: (Math.max(1, page) - 1) * Math.max(1, limit),
    orderBy: { [sortField || "createdAt"]: sortDir === "asc" ? "asc" : "desc" } as Record<string, "asc" | "desc">
  };
}
