import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NovoCliente from './pages/NovoCliente.jsx'
import DetalheCliente from './pages/DetalheCliente.jsx'

export default function App() {
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
