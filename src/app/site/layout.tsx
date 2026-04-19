import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-wrapper">
      <Header />
      <main className="container">
        {children}
      </main>
      <Footer />
    </div>
  );
}
