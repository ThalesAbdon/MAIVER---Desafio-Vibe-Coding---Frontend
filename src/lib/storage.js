// Camada de persistência. Todo acesso ao localStorage passa por aqui.
// Se um dia trocarmos por Supabase/SQLite, só este arquivo muda.

const STORAGE_KEY = 'maiver:clientes'

export function loadClientes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (err) {
    console.error('Erro ao carregar clientes do storage:', err)
    return []
  }
}

export function saveClientes(clientes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))
  } catch (err) {
    console.error('Erro ao salvar clientes no storage:', err)
  }
}
