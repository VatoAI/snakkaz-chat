
import { ProjectCard, ProjectProps } from "../ProjectCard";

interface CategorySectionProps {
  title: string;
  category: ProjectProps['category'];
  projects: (ProjectProps & { isFeatured?: boolean })[];
}

export const CategorySection = ({ title, category, projects }: CategorySectionProps) => {
  // Filter projects by category and exclude featured projects
  const categoryProjects = projects.filter(project => 
    project.category === category && !project.isFeatured
  );
  
  if (categoryProjects.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-12">
      <h2 
        className="text-2xl font-bold mb-4 pb-2"
        style={{
          borderImage: 'linear-gradient(90deg, #1a9dff, #d62828) 1',
          borderBottom: '2px solid',
          background: 'linear-gradient(90deg, #1a9dff, #ffffff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryProjects.map((project) => (
          <ProjectCard key={project.previewUrl} {...project} />
        ))}
      </div>
    </div>
  );
};
