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
      <div id="journey"><MyJourney /></div>
      <div id="projects"><ProjectsSection /></div>
      <div id="music"><MusicSection /></div>
      <MovieSection />
      <div id="about"><AboutMe /></div>
    </main>
  );
}
