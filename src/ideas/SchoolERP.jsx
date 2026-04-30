import ProjectCard from '../components/ProjectCard';

export default function ArtBridge() {
  return (
    <ProjectCard
      id="003"
      name="School"
      highlight="ERP"
      description= "Comprehensive School ERP System Design Based on modern school management system design patterns"
      tags={['Schools', 'Management', 'Automation']}
      starred={true}
      href="/prototypes/schoolerp"
    />
  );
}