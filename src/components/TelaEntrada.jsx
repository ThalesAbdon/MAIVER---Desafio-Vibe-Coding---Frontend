import { CONSULTORES } from '../lib/consultores.js'
import { useConsultorAtual } from '../context/ConsultorAtualContext.jsx'

export default function TelaEntrada() {
  const { setConsultor } = useConsultorAtual()

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-6xl mb-3 leading-none">Maiver</h1>
          <p className="text-xs uppercase tracking-widest text-ink/50">
            Central de Onboarding
          </p>
        </div>
        <p className="text-center mb-6 text-ink/60">Quem está acessando?</p>
        <div className="space-y-2">
          {CONSULTORES.map(c => (
            <button
              key={c}
              onClick={() => setConsultor(c)}
              className="w-full p-5 border border-ink/10 hover:border-ink text-left transition-colors group"
            >
              <div className="font-medium">{c}</div>
              <div className="text-sm text-ink/40 group-hover:text-ink/70 transition-colors">
                Consultor Maiver
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink/40 text-center mt-8">
          Esta seleção controla quais onboardings você pode atualizar.
        </p>
      </div>
    </div>
  )
}