import { Link, useLocation } from 'react-router-dom'
import { useConsultorAtual } from '../context/ConsultorAtualContext.jsx'

export default function Layout({ children }) {
  const location = useLocation()
  const naoMostrarBotao = location.pathname === '/clientes/novo'
  const { consultor, sair } = useConsultorAtual()

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
          <div className="flex items-center gap-4">
            <div className="text-sm flex items-baseline gap-2">
              <span className="text-ink/40">Logado como</span>
              <span className="font-medium">{consultor}</span>
              <button
                onClick={sair}
                className="text-xs text-ink/40 hover:text-ink underline-offset-2 hover:underline"
              >
                trocar
              </button>
            </div>
            {!naoMostrarBotao && (
              <Link
                to="/clientes/novo"
                className="bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                + Novo cliente
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
    </div>
  )
}