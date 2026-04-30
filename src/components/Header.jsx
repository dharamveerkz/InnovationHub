// src/components/Header.jsx
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Link href="/" className="logo-link" aria-label="Go to home">
        <div className="logo fade-in">DHARAM<span>VEER</span></div>
      </Link>
      
      <nav className="fade-in delay-1">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}