// src/ideas/HealthScanAI.jsx
import ProjectCard from '../components/ProjectCard';

export default function HealthScanAI() {
  return (
    <ProjectCard
      id="001"
      name="HealthScan"
      highlight="AI"
      description="Upload a lab report, get instant AI-powered insights. Decodes complex medical data into plain language — no doctor visit needed for the basics."
      tags={['AI', 'Health', 'OCR']}
      starred={true}
      href="/prototypes/healthscan-ai"
    />
  );
}