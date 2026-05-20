import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext.jsx'
import { criarCliente } from '../lib/clientes.js'

const PLANOS = ['Básico', 'Pro', 'Enterprise']

const ESTADO_INICIAL = {
  empresa: '',
  responsavel: '',
  email: '',
  telefone: '',
  plano: 'Pro',
  dataInicio: new Date().toISOString().slice(0, 10),
  consultor: '',
}

export default function NovoCliente() {
  const navigate = useNavigate()
  const { adicionarCliente } = useClientes()
  const [form, setForm] = useState(ESTADO_INICIAL)
  const [erros, setErros] = useState({})

  function atualizar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
    // Limpa erro do campo ao digitar — feedback imediato.
    if (erros[campo]) {
      setErros(prev => ({ ...prev, [campo]: undefined }))
    }
  }

  function validar() {
    const e = {}
    if (!form.empresa.trim()) e.empresa = 'Obrigatório'
    if (!form.responsavel.trim()) e.responsavel = 'Obrigatório'
    if (!form.email.trim()) e.email = 'Obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'E-mail inválido'
    }
    if (!form.consultor.trim()) e.consultor = 'Obrigatório'
    if (!form.dataInicio) e.dataInicio = 'Obrigatório'
    return e
  }

  function submeter(ev) {
    ev.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
    const cliente = criarCliente(form)
    adicionarCliente(cliente)
    navigate(`/clientes/${cliente.id}`)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="font-serif text-5xl mb-3 leading-tight">Novo cliente</h1>
        <p className="text-ink/60">
          Cadastre os dados básicos. As 6 etapas de onboarding serão criadas
          automaticamente.
        </p>
      </div>

      <form onSubmit={submeter} className="space-y-6">
        <Campo
          label="Empresa"
          valor={form.empresa}
          erro={erros.empresa}
          onChange={v => atualizar('empresa', v)}
        />
        <Campo
          label="Responsável de contato"
          valor={form.responsavel}
          erro={erros.responsavel}
          onChange={v => atualizar('responsavel', v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="E-mail"
            type="email"
            valor={form.email}
            erro={erros.email}
            onChange={v => atualizar('email', v)}
          />
          <Campo
            label="Telefone"
            valor={form.telefone}
            onChange={v => atualizar('telefone', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Plano</label>
            <select
              value={form.plano}
              onChange={ev => atualizar('plano', ev.target.value)}
              className="w-full border border-ink/20 px-3 py-2 bg-paper focus:border-ink outline-none transition-colors"
            >
              {PLANOS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <Campo
            label="Data de início"
            type="date"
            valor={form.dataInicio}
            erro={erros.dataInicio}
            onChange={v => atualizar('dataInicio', v)}
          />
        </div>
        <Campo
          label="Consultor responsável"
          valor={form.consultor}
          erro={erros.consultor}
          onChange={v => atualizar('consultor', v)}
        />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-ink text-paper px-6 py-3 font-medium hover:bg-accent transition-colors"
          >
            Cadastrar cliente
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 text-ink/60 hover:text-ink transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

// Componente local — só usado neste arquivo, então fica aqui.
function Campo({ label, valor, onChange, erro, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={valor}
        onChange={ev => onChange(ev.target.value)}
        className={`w-full border px-3 py-2 bg-paper outline-none transition-colors ${
          erro
            ? 'border-red-500 focus:border-red-500'
            : 'border-ink/20 focus:border-ink'
        }`}
      />
      {erro && (
        <span className="text-xs text-red-500 mt-1 block">{erro}</span>
      )}
    </div>
  )
}
