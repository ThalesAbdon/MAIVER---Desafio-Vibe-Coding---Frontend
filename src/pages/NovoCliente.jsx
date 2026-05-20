import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext.jsx'
import { criarCliente } from '../lib/clientes.js'
import { CONSULTORES } from '../lib/consultores.js'
import {
  validarEmpresa,
  validarResponsavel,
  validarEmail,
  validarTelefone,
  validarConsultor,
  validarDataInicio,
  sanitizarResponsavel,
} from '../lib/validators.js'

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

// Dispatcher: mapeia o nome do campo pra função validadora correta.
// Centraliza a lógica em vez de espalhar ifs pelo componente.
const VALIDADORES = {
  empresa: validarEmpresa,
  responsavel: validarResponsavel,
  email: validarEmail,
  telefone: validarTelefone,
  consultor: validarConsultor,
  dataInicio: validarDataInicio,
}

function validarCampo(campo, valor) {
  return VALIDADORES[campo]?.(valor) ?? null
}

export default function NovoCliente() {
  const navigate = useNavigate()
  const { adicionarCliente } = useClientes()
  const [form, setForm] = useState(ESTADO_INICIAL)
  const [erros, setErros] = useState({})
  // Set de campos que o usuário já interagiu (sofreu blur ao menos uma vez).
  // Antes do primeiro blur, não mostramos erro — evita "atacar" o usuário.
  const [tocados, setTocados] = useState(new Set())

  function atualizar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
    // Live validation: só revalida se o campo já foi tocado.
    if (tocados.has(campo)) {
      setErros(prev => ({ ...prev, [campo]: validarCampo(campo, valor) }))
    }
  }

  function aoSair(campo) {
    // Marca como tocado e valida na hora.
    setTocados(prev => new Set(prev).add(campo))
    setErros(prev => ({ ...prev, [campo]: validarCampo(campo, form[campo]) }))
  }

  function validarTudo() {
    return Object.fromEntries(
      Object.keys(VALIDADORES)
        .map(c => [c, validarCampo(c, form[c])])
        .filter(([, erro]) => erro !== null)
    )
  }

  function submeter(ev) {
    ev.preventDefault()
    const novosErros = validarTudo()
    if (Object.keys(novosErros).length > 0) {
      // Marca todos os campos com erro como tocados, pra que apareçam.
      setTocados(prev => {
        const novo = new Set(prev)
        Object.keys(novosErros).forEach(c => novo.add(c))
        return novo
      })
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
          onBlur={() => aoSair('empresa')}
        />
        <Campo
          label="Responsável de contato"
          valor={form.responsavel}
          erro={erros.responsavel}
          // Aplica sanitização ANTES de salvar no state.
          // Resultado: números são rejeitados em tempo real, sem erro visual.
          onChange={v => atualizar('responsavel', sanitizarResponsavel(v))}
          onBlur={() => aoSair('responsavel')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="E-mail"
            type="email"
            valor={form.email}
            erro={erros.email}
            onChange={v => atualizar('email', v)}
            onBlur={() => aoSair('email')}
          />
          <Campo
            label="Telefone"
            valor={form.telefone}
            erro={erros.telefone}
            placeholder="+55 11 99999-9999"
            onChange={v => atualizar('telefone', v)}
            onBlur={() => aoSair('telefone')}
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
            onBlur={() => aoSair('dataInicio')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Consultor responsável
          </label>
          <select
            value={form.consultor}
            onChange={ev => atualizar('consultor', ev.target.value)}
            onBlur={() => aoSair('consultor')}
            className={`w-full border px-3 py-2 bg-paper outline-none transition-colors ${
              erros.consultor
                ? 'border-red-500 focus:border-red-500'
                : 'border-ink/20 focus:border-ink'
            }`}
          >
            <option value="">Selecione um consultor</option>
            {CONSULTORES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {erros.consultor && (
            <span className="text-xs text-red-500 mt-1 block">
              {erros.consultor}
            </span>
          )}
        </div>

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

function Campo({ label, valor, onChange, onBlur, erro, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={valor}
        onChange={ev => onChange(ev.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full border px-3 py-2 bg-paper outline-none transition-colors ${
          erro
            ? 'border-red-500 focus:border-red-500'
            : 'border-ink/20 focus:border-ink'
        }`}
      />
      {erro && <span className="text-xs text-red-500 mt-1 block">{erro}</span>}
    </div>
  )
}