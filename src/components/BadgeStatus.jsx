// Badge visual do status de onboarding.
// Usado em Dashboard e em DetalheCliente.

const STATUS_CONFIG = {
  'em-andamento': { texto: 'Em andamento', cor: 'bg-ink/5 text-ink/70' },
  'concluido':    { texto: 'Concluído',    cor: 'bg-green-100 text-green-800' },
  'atrasado':     { texto: 'Atrasado',     cor: 'bg-red-100 text-red-800' },
}

export default function BadgeStatus({ status }) {
  const { texto, cor } = STATUS_CONFIG[status]
  return <span className={`text-xs px-2 py-1 ${cor}`}>{texto}</span>
}