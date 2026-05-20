// Validações de formulário. Cada função recebe o valor e retorna:
// - string com mensagem de erro
// - null se está válido
// Esse padrão "null = ok" é simples e fácil de combinar.

export function validarEmpresa(valor) {
  const limpo = valor.trim()
  if (!limpo) return 'Obrigatório'
  if (limpo.length < 1) return 'Mínimo 1 caractere'
  return null
}

export function validarResponsavel(valor) {
  const limpo = valor.trim()
  if (!limpo) return 'Obrigatório'
  // \p{L} = qualquer letra Unicode (cobre acentos: ç, á, ã, é...)
  // Flag /u é obrigatória pra usar \p{}
  if (!/^[\p{L}\s]+$/u.test(limpo)) {
    return 'Apenas letras e espaços'
  }
  return null
}

export function validarEmail(valor) {
  const limpo = valor.trim()
  if (!limpo) return 'Obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo)) {
    return 'E-mail inválido'
  }
  return null
}

// Aceita formatos BR e internacionais com DDI/DDD.
// Exemplos válidos: +55 11 99999-9999, (11) 99999-9999, 1199999999,
// +1 555 555 5555, +44 20 1234 5678
export function validarTelefone(valor) {
  const limpo = valor.trim()
  if (!limpo) return 'Obrigatório'

  // Formato: + opcional no início, depois dígitos, espaços, traços, parênteses
  if (!/^\+?[\d\s\-()]+$/.test(limpo)) {
    return 'Use apenas números, espaços, +, - e parênteses'
  }

  // Conta os dígitos puros (ignora formatação)
  const digitos = limpo.replace(/\D/g, '')

  // E.164 (padrão internacional): 8 a 15 dígitos
  // BR sem DDI: 10 (fixo) ou 11 (celular)
  // BR com DDI: 12 ou 13
  if (digitos.length < 10 || digitos.length > 15) {
    return 'Telefone deve ter entre 10 e 15 dígitos'
  }

  return null
}

export function validarConsultor(valor) {
  if (!valor) return 'Selecione um consultor'
  return null
}

export function validarDataInicio(valor) {
  if (!valor) return 'Obrigatório'
  return null
}

export function sanitizarResponsavel(valor) {
  return valor.replace(/[^\p{L}\s]/gu, '')
}