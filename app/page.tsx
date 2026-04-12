import HeroSection from "@/components/HeroSection";
import MusicSection from "@/components/MusicSection";
import MovieSection from "@/components/MoviesSection";
import Skills from '@/components/Skills'
import MyJourney from "@/components/MyJourney";
import ProjectsSection from '@/components/ProjectsSection';
export default function Home() {

  return (
    <main className="min-h-screen  ">

      <HeroSection />

      <Skills/>

      <ProjectsSection/>

      <MusicSection />

      <MovieSection />
      
      <MyJourney/>

    </main>
  );
}
