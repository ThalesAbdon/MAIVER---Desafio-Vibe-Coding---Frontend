import { useParams, Link } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext.jsx'

// Esta tela vai receber o checklist completo na próxima iteração.
// Por enquanto, só mostra que o cliente foi salvo.

export default function DetalheCliente() {
  const { id } = useParams()
  const { obterCliente } = useClientes()
  const cliente = obterCliente(id)

  if (!cliente) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-3xl mb-4">Cliente não encontrado</h1>
        <Link to="/" className="text-accent hover:underline">
          ← Voltar para o dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/"
        className="text-sm text-ink/60 hover:text-ink mb-6 inline-block transition-colors"
      >
        ← Voltar
      </Link>
      <h1 className="font-serif text-5xl mb-2 leading-tight">
        {cliente.empresa}
      </h1>
      <p className="text-ink/60 mb-10">
        Responsável: {cliente.responsavel} · Consultor: {cliente.consultor}
      </p>

      <div className="p-6 border border-ink/10 bg-yellow-50">
        <p className="text-sm">
          ⚠️ Checklist de etapas — vamos construir na próxima iteração.
        </p>
      </div>
    </div>
  )
}
