// Identidade do consultor logado. Persistida em localStorage —
// se a pessoa fechar o browser e voltar, continua "logada".
// Não é autenticação real, é só um picker de identidade.

import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'maiver:consultor_atual'
const ConsultorAtualContext = createContext(null)

export function ConsultorAtualProvider({ children }) {
  const [consultor, setConsultor] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || null
  })

  useEffect(() => {
    if (consultor) {
      localStorage.setItem(STORAGE_KEY, consultor)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [consultor])

  function sair() {
    setConsultor(null)
  }

  return (
    <ConsultorAtualContext.Provider value={{ consultor, setConsultor, sair }}>
      {children}
    </ConsultorAtualContext.Provider>
  )
}

export function useConsultorAtual() {
  const ctx = useContext(ConsultorAtualContext)
  if (!ctx) {
    throw new Error('useConsultorAtual deve ser usado dentro de <ConsultorAtualProvider>')
  }
  return ctx
}