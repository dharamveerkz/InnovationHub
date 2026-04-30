import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="logo fade-in">DHARAM<span>VEER</span></div>
      <nav className="fade-in delay-1">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
