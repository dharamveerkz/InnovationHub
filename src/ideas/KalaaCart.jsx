import ProjectCard from '../components/ProjectCard';

export default function KalaaCart() {
  return (
    <ProjectCard
      id="004"
      name="Kalaa"
      highlight="Cart"
      description= "Kalaacart is a premium e-commerce platform showcasing authentic, handmade art and crafts from Bihar's heritage artisans—where every purchase preserves a tradition."
      tags={['Handmade', 'Bihar', 'Heritage']}
      starred={true}
      href="/prototypes/kalaacart"
    />
  );
}