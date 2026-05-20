// Regras de negócio puras sobre clientes. Não toca DOM, não conhece React.
// Vantagem: dá pra testar com Vitest/Jest sem precisar de jsdom.

import { v4 as uuid } from 'uuid'
import { criarEtapasNovas } from './etapas.js'

export function criarCliente(dados) {
  return {
    id: uuid(),
    empresa: dados.empresa,
    responsavel: dados.responsavel,
    email: dados.email,
    telefone: dados.telefone,
    plano: dados.plano,
    dataInicio: dados.dataInicio,
    consultor: dados.consultor,
    etapas: criarEtapasNovas(),
    criadoEm: new Date().toISOString(),
  }
}

export function calcularProgresso(cliente) {
  const total = cliente.etapas.length
  const concluidas = cliente.etapas.filter(e => e.concluida).length
  return {
    concluidas,
    total,
    percentual: total === 0 ? 0 : concluidas / total,
  }
}

// Status: 'concluido' | 'atrasado' | 'em-andamento'
// Atrasado = passou de 30 dias da dataInicio e ainda não concluiu.
export function calcularStatus(cliente) {
  const { concluidas, total } = calcularProgresso(cliente)
  if (concluidas === total) return 'concluido'

  const inicio = new Date(cliente.dataInicio)
  const hoje = new Date()
  const dias = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24))
  if (dias > 30) return 'atrasado'

  return 'em-andamento'
}
