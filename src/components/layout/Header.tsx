import { Link } from 'react-router-dom'
import './Header.css'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          Snehasish Chakraborty
        </Link>
        <nav className="header-nav">
          <Link to="/" className="hover:text-foreground transition-colors">Blog</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
      </div>
    </header>
  )
}
