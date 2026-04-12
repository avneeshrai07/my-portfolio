import HeroSection from "@/components/HeroSection";
import MusicSection from "@/components/MusicSection";
import MovieSection from "@/components/MoviesSection";
import Skills from '@/components/Skills'
import MyJourney from "@/components/MyJourney";
import ProjectsCarousel from '@/components/projects/ProjectsCarousel'


export default function Home() {

  return (
    <main className="min-h-screen  ">
      {/* Hero Section */}
      <HeroSection />


      
      {/* Music Section */}
      <Skills/>
      <MusicSection />

      <MovieSection />
      
      <MyJourney/>

      
      <ProjectsCarousel />
 

    </main>
  );
}
