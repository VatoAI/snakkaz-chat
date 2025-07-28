import { useNavigate } from 'react-router-dom';
import { ProjectProps } from "./ProjectCard";
import { CategorySection } from "./projects/CategorySection";
import { FeaturedProject } from "./projects/FeaturedProject";
import { projects } from "./projects/projectData";

export const ProjectGrid = () => {
  const navigate = useNavigate();
  
  const handleChatRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/chat');
  };
  
  const featuredProject = projects.find(p => p.isFeatured);
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <FeaturedProject project={featuredProject} />
      
      <h1 
        className="text-3xl font-bold text-center mb-8"
        style={{
          background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '-5px 0 15px rgba(26,157,255,0.4), 5px 0 15px rgba(214,40,40,0.4)',
        }}
      >
        SnakkaZ Prosjekter
      </h1>
      
      <CategorySection title="Kommunikasjon" category="chat" projects={projects} />
      <CategorySection title="Forretningsverktøy" category="business" projects={projects} />
      <CategorySection title="Analyse & Innsikt" category="analytics" projects={projects} />
      <CategorySection title="Infrastruktur" category="infrastructure" projects={projects} />
      
      <div className="mt-10 text-center">
        <button 
          onClick={handleChatRedirect}
          className="inline-block px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
            color: 'white',
            boxShadow: '0 0 15px rgba(26,157,255,0.4), 0 0 15px rgba(214,40,40,0.4)'
          }}
        >
          Start SnakkaZ
        </button>
      </div>
    </div>
  );
};
