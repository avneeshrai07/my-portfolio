import HeroSection from "@/components/HeroSection";
import MusicSection from "@/components/MusicSection";
import MovieSection from "@/components/MoviesSection";
import Skills from '@/components/Skills'
import MyJourney from "@/components/MyJourney";
import ProjectsCarousel from '@/components/projects/ProjectsCarousel'
// import BookCard from '@/components/ProjectCard'
import ProjectsSection from '@/components/ProjectsSection';
export default function Home() {

  return (
    <main className="min-h-screen  ">
      {/* Hero Section */}
      <HeroSection />

      
      
      {/* Music Section */}
      <Skills/>

      <ProjectsSection/>
      
      <MusicSection />

      <MovieSection />
      
      <MyJourney/>

      
      <ProjectsCarousel />
 

    </main>
  );
}
