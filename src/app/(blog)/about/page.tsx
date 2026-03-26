export const metadata = {
  title: "About | Travel.",
  description: "About the authors and the mission behind this travel and lifestyle blog.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">

      {/* Hero — mesmo padrão da Home */}
      <section className="py-20 mb-12 flex flex-col items-start justify-center text-left space-y-6">
        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl">
          About Us.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          We are a small team of writers, photographers, and travelers documenting
          the world one story at a time. This is a placeholder — update it with
          your own story whenever you&apos;re ready.
        </p>
      </section>

      {/* Corpo — placeholder simples */}
      <section className="max-w-2xl space-y-6 text-muted-foreground leading-relaxed pb-20">
        <p>
          This blog was built with{" "}
          <a href="https://wisp.blog" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
            Wisp CMS
          </a>
          , Next.js, and Shadcn UI. The idea is to keep things minimal — great
          content first, design second.
        </p>
        <p>
          Feel free to replace this text with your own bio, mission statement, or
          anything else you&apos;d like your readers to know about you.
        </p>
      </section>

    </div>
  );
}
