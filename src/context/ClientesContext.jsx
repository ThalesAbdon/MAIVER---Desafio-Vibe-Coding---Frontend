// Context global de clientes. Abstrai persistência e expõe operações
// de leitura/escrita. Componentes consomem via useClientes() e não
// sabem que existe localStorage.

import { createContext, useContext, useState, useEffect } from 'react'
import { loadClientes, saveClientes } from '../lib/storage.js'

const ClientesContext = createContext(null)

export function ClientesProvider({ children }) {
  // Lazy initializer: roda só uma vez, no primeiro render.
  const [clientes, setClientes] = useState(() => loadClientes())

  // Sincroniza com localStorage sempre que a lista muda.
  useEffect(() => {
    saveClientes(clientes)
  }, [clientes])

  function adicionarCliente(novo) {
    setClientes(prev => [...prev, novo])
  }

  function atualizarCliente(id, patch) {
    setClientes(prev =>
      prev.map(c => (c.id === id ? { ...c, ...patch } : c))
    )
  }

  function atualizarEtapa(clienteId, etapaId, patch) {
    setClientes(prev =>
      prev.map(c => {
        if (c.id !== clienteId) return c
        return {
          ...c,
          etapas: c.etapas.map(e =>
            e.id === etapaId ? { ...e, ...patch } : e
          ),
        }
      })
    )
  }

  function obterCliente(id) {
    return clientes.find(c => c.id === id)
  }

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        adicionarCliente,
        atualizarCliente,
        atualizarEtapa,
        obterCliente,
      }}
    >
      {children}
    </ClientesContext.Provider>
  )
}

// Hook de acesso. Joga erro se usado fora do Provider — assim
// erros aparecem cedo, em desenvolvimento, em vez de virar bug sutil.
export function useClientes() {
  const ctx = useContext(ClientesContext)
  if (!ctx) {
    throw new Error('useClientes deve ser usado dentro de <ClientesProvider>')
  }
  return ctx
}
