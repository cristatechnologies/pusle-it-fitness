import BlogDetail from "@/Theme/page-components/blog/blog-details";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;

  return <BlogDetail slug={resolvedParams.slug} />;
}
