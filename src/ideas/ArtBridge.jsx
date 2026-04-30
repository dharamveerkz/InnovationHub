import ProjectCard from '../components/ProjectCard';

export default function ArtBridge() {
  return (
    <ProjectCard
      id="002"
      name="Art"
      highlight="Bridge"
      description="A marketplace connecting emerging artists directly to buyers. No gallery cuts — just art, story, and fair pricing."
      tags={['Marketplace', 'Creators', 'Web3']}
      starred={true}
      href="/prototypes/artbridge"
    />
  );
}
