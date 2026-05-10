import ProjectCard from '../components/ProjectCard';

export default function VeerCraft() {
  return (
    <ProjectCard
      id="007"
      name="Veer"
      highlight="Craft"
      description= "VeerCraft is a print-on-demand business that helps people and companies turn their ideas into physical products — business cards, custom t-shirts, banners, gifts, wedding cards, and more.
The core idea is simple: you imagine it, we print it."
      tags={['Print', 'Design', 'POD']}
      starred={true}
      href="/prototypes/veercraft"
    />
  );
}