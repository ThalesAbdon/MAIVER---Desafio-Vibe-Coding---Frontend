import { Link } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext.jsx'
import { calcularProgresso, calcularStatus } from '../lib/clientes.js'

export default function Dashboard() {
  const { clientes } = useClientes()

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
      <div className="mb-10">
        <h1 className="font-serif text-5xl mb-2 leading-tight">
          Onboardings ativos
        </h1>
        <p className="text-ink/60">
          {clientes.length}{' '}
          {clientes.length === 1 ? 'cliente' : 'clientes'} em acompanhamento
        </p>
      </div>

      <div className="space-y-3">
        {clientes.map(cliente => (
          <CardCliente key={cliente.id} cliente={cliente} />
        ))}
      </div>
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

function BadgeStatus({ status }) {
  const config = {
    'em-andamento': { texto: 'Em andamento', cor: 'bg-ink/5 text-ink/70' },
    'concluido':    { texto: 'Concluído',    cor: 'bg-green-100 text-green-800' },
    'atrasado':     { texto: 'Atrasado',     cor: 'bg-red-100 text-red-800' },
  }
  const { texto, cor } = config[status]
  return <span className={`text-xs px-2 py-1 ${cor}`}>{texto}</span>
}
