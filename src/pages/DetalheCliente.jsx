import { useParams, Link, Navigate } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext.jsx'
import { useConsultorAtual } from '../context/ConsultorAtualContext.jsx'
import { calcularProgresso, calcularStatus } from '../lib/clientes.js'
import { formatarData } from '../lib/format.js'
import BadgeStatus from '../components/BadgeStatus.jsx'

export default function DetalheCliente() {
  const { id } = useParams()
  const { obterCliente, atualizarEtapa } = useClientes()
  const { consultor: consultorAtual } = useConsultorAtual()
  const cliente = obterCliente(id)

  if (!cliente) return <Navigate to="/" replace />

  // Permissão: só o consultor responsável edita.
  // Isso NÃO é segurança real (front-end nunca é) — é gating de workflow.
  const podeEditar = cliente.consultor === consultorAtual

  const { concluidas, total, percentual } = calcularProgresso(cliente)
  const status = calcularStatus(cliente)

  function alternarEtapa(etapaId, jaConcluida) {
    if (!podeEditar) return // defesa em profundidade
    atualizarEtapa(id, etapaId, {
      concluida: !jaConcluida,
      concluidaEm: !jaConcluida ? new Date().toISOString() : null,
    })
  }

  function alterarNota(etapaId, nota) {
    if (!podeEditar) return
    atualizarEtapa(id, etapaId, { nota })
  }

  return (
    <div>
      <Link
        to="/"
        className="text-sm text-ink/60 hover:text-ink mb-6 inline-block transition-colors"
      >
        ← Voltar
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="font-serif text-5xl leading-tight">{cliente.empresa}</h1>
        <div className="mt-3 flex-shrink-0">
          <BadgeStatus status={status} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-8">
        <Info label="Responsável" valor={cliente.responsavel} />
        <Info label="E-mail" valor={cliente.email} />
        <Info label="Telefone" valor={cliente.telefone || '—'} />
        <Info label="Plano" valor={cliente.plano} />
        <Info label="Início" valor={formatarData(cliente.dataInicio)} />
        <Info label="Consultor" valor={cliente.consultor} />
      </dl>

      {!podeEditar && (
        <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-8">
          Apenas <strong>{cliente.consultor}</strong> pode atualizar este onboarding.
          Você está visualizando como <strong>{consultorAtual}</strong>.
        </div>
      )}

      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progresso do onboarding</span>
          <span className="text-sm text-ink/60 tabular-nums">
            {concluidas}/{total} etapas
          </span>
        </div>
        <div className="h-1 bg-ink/10 overflow-hidden">
          <div
            className="h-full bg-ink transition-all"
            style={{ width: `${percentual * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xs uppercase tracking-widest text-ink/50 mb-4">
        Checklist de etapas
      </h2>
      <div className="space-y-2">
        {cliente.etapas.map(etapa => (
          <EtapaItem
            key={etapa.id}
            etapa={etapa}
            podeEditar={podeEditar}
            onAlternar={() => alternarEtapa(etapa.id, etapa.concluida)}
            onAlterarNota={nota => alterarNota(etapa.id, nota)}
          />
        ))}
      </div>
    </div>
  )
}

function Info({ label, valor }) {
  return (
    <div>
      <dt className="text-ink/40 inline">{label}: </dt>
      <dd className="text-ink/70 inline">{valor}</dd>
    </div>
  )
}

function EtapaItem({ etapa, podeEditar, onAlternar, onAlterarNota }) {
  return (
    <div
      className={`border p-5 transition-colors ${
        etapa.concluida
          ? 'bg-ink/5 border-ink/10'
          : 'border-ink/10 hover:border-ink/20'
      } ${!podeEditar ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onAlternar}
          disabled={!podeEditar}
          aria-label={
            etapa.concluida ? 'Desmarcar etapa' : 'Marcar como concluída'
          }
          className={`flex-shrink-0 w-5 h-5 mt-1 border transition-colors flex items-center justify-center ${
            etapa.concluida
              ? 'bg-ink border-ink text-paper'
              : 'border-ink/30'
          } ${podeEditar ? 'hover:border-ink cursor-pointer' : 'cursor-not-allowed'}`}
        >
          {etapa.concluida && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h3
              className={`font-medium ${
                etapa.concluida ? 'text-ink/60 line-through' : ''
              }`}
            >
              {etapa.nome}
            </h3>
            {etapa.concluidaEm && (
              <span className="text-xs text-ink/40 tabular-nums flex-shrink-0">
                {formatarData(etapa.concluidaEm)}
              </span>
            )}
          </div>
          <textarea
            value={etapa.nota}
            onChange={ev => onAlterarNota(ev.target.value)}
            readOnly={!podeEditar}
            placeholder={podeEditar ? 'Adicionar nota (opcional)…' : ''}
            rows={1}
            className="w-full mt-2 text-sm bg-transparent border-none outline-none resize-y text-ink/70 placeholder:text-ink/30 focus:text-ink leading-relaxed disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}