import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Skills } from "@/components/landing/skills";
import { AboutFounder } from "@/components/landing/about-founder";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Skills />
        <AboutFounder />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
