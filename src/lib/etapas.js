// Etapas fixas de onboarding. MVP: não configurável, sempre as 6 abaixo.
// Para tornar configurável no futuro, basta mover isso pro localStorage.

export const ETAPAS_PADRAO = [
  { id: 'kickoff',     nome: 'Reunião de kickoff realizada' },
  { id: 'acesso',      nome: 'Acesso à plataforma configurado' },
  { id: 'sms',         nome: 'Integração de SMS ativada' },
  { id: 'fluxo',       nome: 'Primeiro fluxo de recuperação criado' },
  { id: 'treinamento', nome: 'Treinamento do time do cliente concluído' },
  { id: 'golive',      nome: 'Go-live aprovado' },
]

// Cria uma cópia "fresca" das etapas para um novo cliente
export function criarEtapasNovas() {
  return ETAPAS_PADRAO.map(e => ({
    id: e.id,
    nome: e.nome,
    concluida: false,
    nota: '',
    concluidaEm: null,
  }))
}
