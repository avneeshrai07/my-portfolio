import HeroSection from "@/components/HeroSection";
import MusicSection from "@/components/MusicSection";
import MovieSection from "@/components/MoviesSection";
import Skills from "@/components/Skills";
import MyJourney from "@/components/MyJourney";
import ProjectsSection from "@/components/ProjectsSection";
import AboutMe from "@/components/AboutMe";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Skills />
      <section id="journey"><MyJourney /></section>
      <section id="projects"><ProjectsSection /></section>
      <section id="music"><MusicSection /></section>
      <MovieSection />
      <section id="about"><AboutMe /></section>
    </main>
  );
}
