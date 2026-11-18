import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  const packages = await prisma.package.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/plan`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const packagePages = packages.map((pkg: any) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: pkg.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const destinationPages = destinations.map((dest: any) => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified: dest.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...packagePages, ...destinationPages];
}
