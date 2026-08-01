import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Skills } from "@/components/landing/skills";
import { FAQ } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Skills />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}