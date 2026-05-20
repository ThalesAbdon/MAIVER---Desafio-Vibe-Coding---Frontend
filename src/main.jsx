import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ClientesProvider } from './context/ClientesContext.jsx'
import { ConsultorAtualProvider } from './context/ConsultorAtualContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConsultorAtualProvider>
        <ClientesProvider>
          <App />
        </ClientesProvider>
      </ConsultorAtualProvider>
    </BrowserRouter>
  </React.StrictMode>,
)