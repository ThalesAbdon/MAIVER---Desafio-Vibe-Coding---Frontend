import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NovoCliente from './pages/NovoCliente.jsx'
import DetalheCliente from './pages/DetalheCliente.jsx'
import TelaEntrada from './components/TelaEntrada.jsx'
import { useConsultorAtual } from './context/ConsultorAtualContext.jsx'

export default function App() {
  const { consultor } = useConsultorAtual()

  // Se ninguém está "logado", mostra a tela de entrada.
  // Bloqueia acesso ao resto da app — comportamento tipo login.
  if (!consultor) return <TelaEntrada />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes/novo" element={<NovoCliente />} />
        <Route path="/clientes/:id" element={<DetalheCliente />} />
      </Routes>
    </Layout>
  )
}