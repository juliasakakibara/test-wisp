import { getConfig } from "@/lib/actions";
import { Metadata } from "next";

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
    <div className="container mx-auto max-w-6xl px-4 py-8">

      {/* Hero — mesmo padrão da Home */}
      <section className="py-20 mb-12 flex flex-col items-start justify-center text-left space-y-6">
        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl" data-editable="aboutTitle">
          {config.aboutTitle}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl" data-editable="aboutIntro">
          {config.aboutIntro}
        </p>
      </section>

      <section className="max-w-2xl space-y-6 text-muted-foreground leading-relaxed pb-20 whitespace-pre-line" data-editable="aboutBody">
        {config.aboutBody}
      </section>

    </div>
  );
}
