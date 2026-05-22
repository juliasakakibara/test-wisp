import { getConfig } from "@/lib/actions";
import { Metadata } from "next"; 
import { Hero } from "@/components/Hero";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: `About | ${config.siteName}`,
    description: config.siteDescription,
  }
}

export default async function AboutPage() {
  const config = await getConfig();
  return (
    <>
      <Hero title={config.aboutTitle} description={config.aboutIntro} />

      <div className="about-text-content">
        {config.aboutBody}
      </div>
    </>
  );
}
