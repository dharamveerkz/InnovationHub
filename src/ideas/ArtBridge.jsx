import ProjectCard from '../components/ProjectCard';

export default function ArtBridge() {
  return (
    <ProjectCard
      id="002"
      name="Art"
      highlight="Bridge"
      description="ArtBridge makes it easy to turn any blank wall into a work of art by connecting you with skilled local artists. Whether you're a homeowner or a business, you can share your vision, compare clear artist bids, and track every step of the project in real time."
      tags={['Marketplace', 'Creators', 'Web3']}
      starred={true}
      href="/prototypes/artbridge"
    />
  );
}
