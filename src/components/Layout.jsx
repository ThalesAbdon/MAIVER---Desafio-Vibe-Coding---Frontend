import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()
  const naoMostrarBotao = location.pathname === '/clientes/novo'

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-paper/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-serif text-2xl leading-none">Maiver</span>
            <span className="text-xs uppercase tracking-widest text-ink/50">
              Central de Onboarding
            </span>
          </Link>
          {!naoMostrarBotao && (
            <Link
              to="/clientes/novo"
              className="bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              + Novo cliente
            </Link>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
