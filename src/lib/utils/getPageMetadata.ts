// lib/getPageMetadata.ts
export async function getPageMetadata(pageName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/user/metadata?page_name=${pageName}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour (optional)
    }
  );

  if (!res.ok) throw new Error("Failed to fetch metadata");

  const data = await res.json();
  return data.metadata?.[0] || null;
}
