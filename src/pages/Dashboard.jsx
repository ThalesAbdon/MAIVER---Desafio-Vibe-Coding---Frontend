import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext.jsx'
import { calcularProgresso, calcularStatus } from '../lib/clientes.js'
import BadgeStatus from '../components/BadgeStatus.jsx'

// Normaliza strings pra comparação:
// 1. minúsculas
// 2. decompoe acentos via NFD (Á vira A + ´)
// 3. remove os caracteres de combinação (´, ~, ç, etc.)
// Resultado: "José" e "jose" viram ambos "jose" — busca insensível
// a maiúsculas e a acentos. Essencial pra nomes brasileiros.
function normalizar(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Dashboard() {
  const { clientes } = useClientes()
  const [filtro, setFiltro] = useState('')

  const filtroAtivo = filtro.trim().length > 0

  const clientesFiltrados = useMemo(() => {
    if (!filtroAtivo) return clientes
    const termo = normalizar(filtro.trim())
    return clientes.filter(c => normalizar(c.consultor).includes(termo))
  }, [clientes, filtro, filtroAtivo])

  if (clientes.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="font-serif text-5xl mb-4 leading-tight">
          Nenhum onboarding ativo
        </h1>
        <p className="text-ink/60 mb-8">
          Cadastre o primeiro cliente para começar a acompanhar o progresso.
        </p>
        <Link
          to="/clientes/novo"
          className="inline-block bg-ink text-paper px-6 py-3 font-medium hover:bg-accent transition-colors"
        >
          Cadastrar primeiro cliente
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-5xl mb-2 leading-tight">
          Onboardings ativos
        </h1>
        <p className="text-ink/60">
          {filtroAtivo
            ? `${clientesFiltrados.length} de ${clientes.length} clientes`
            : `${clientes.length} ${clientes.length === 1 ? 'cliente' : 'clientes'} em acompanhamento`}
        </p>
      </div>

      <div className="mb-8 relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por consultor responsável…"
          value={filtro}
          onChange={ev => setFiltro(ev.target.value)}
          className="w-full border border-ink/20 pl-10 pr-10 py-2 bg-paper focus:border-ink outline-none transition-colors"
        />
        {filtroAtivo && (
          <button
            onClick={() => setFiltro('')}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-ink/20">
          <p className="text-ink/60">
            Nenhum cliente para{' '}
            <span className="text-ink">"{filtro}"</span>.
          </p>
          <button
            onClick={() => setFiltro('')}
            className="text-sm text-accent hover:underline mt-2"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {clientesFiltrados.map(cliente => (
            <CardCliente key={cliente.id} cliente={cliente} />
          ))}
        </div>
      )}
    </div>
  )
}

function CardCliente({ cliente }) {
  const { concluidas, total, percentual } = calcularProgresso(cliente)
  const status = calcularStatus(cliente)

  return (
    <Link
      to={`/clientes/${cliente.id}`}
      className="block border border-ink/10 hover:border-ink/30 p-6 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-medium text-lg">{cliente.empresa}</h2>
          <p className="text-sm text-ink/60">
            {cliente.consultor} · Plano {cliente.plano}
          </p>
        </div>
        <BadgeStatus status={status} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-1 bg-ink/10 overflow-hidden">
          <div
            className="h-full bg-ink transition-all"
            style={{ width: `${percentual * 100}%` }}
          />
        </div>
        <span className="text-sm text-ink/60 tabular-nums">
          {concluidas}/{total} etapas
        </span>
      </div>
    </Link>
  )
}