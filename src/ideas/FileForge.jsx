import ProjectCard from '../components/ProjectCard';

export default function FileForge() {
  return (
    <ProjectCard
      id="006"
      name="File"
      highlight="Forge"
      description="FileForge is a sleek, browser-based toolkit that instantly converts images, generates PDFs, and runs AI-powered file analysis."
      tags={['Image', 'PDF', 'DocX']}
      starred={true}
      href="/prototypes/fileforge"
    />
  );
}