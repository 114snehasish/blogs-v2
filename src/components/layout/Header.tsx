import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Snehasish Chakraborty
        </Link>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Blog</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
      </div>
    </header>
  )
}
