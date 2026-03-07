import { MetadataRoute } from "next";
import { vehicles } from "./lib/vehicles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://garciasautosalesrgv.com";

  const vehicleUrls = vehicles.map((v) => ({
    url: `${baseUrl}/inventory/${encodeURIComponent(v.id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...vehicleUrls,
  ];
}