export default function ProjectCard({ 
  id, 
  name, 
  highlight, 
  description, 
  tags = [], 
  starred = true,
  href = "#" 
}) {
  return (
    <a className="project-card" href={href}>
      <div className="card-inner">
        <div className="card-top">
    
          <span className="card-arrow">↗</span>
        </div>
        <div className="card-name">{name}<span className="highlight">{highlight}</span></div>
        <p className="card-desc">{description}</p>
        <div className="tags">
          {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
        </div>
      </div>
      {starred && <div className="card-status"><span className="status-dot"></span></div>}
    </a>
  );
}
