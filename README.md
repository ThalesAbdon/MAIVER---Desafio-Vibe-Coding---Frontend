# Central de Onboarding · Maiver

MVP para gerenciar o onboarding de novos clientes Maiver.
Construído com vibe coding (React + Vite + Tailwind + localStorage).

## Como rodar

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

## Stack

- **React 18 + Vite** — setup rápido, hot reload instantâneo
- **Tailwind CSS** — estilização utilitária, prompts pra IA mais determinísticos
- **React Router** — três rotas (dashboard, novo cliente, detalhe)
- **localStorage** — persistência local, zero setup
- **uuid** — IDs à prova de colisão

## Arquitetura

```
src/
├── lib/                    # Lógica pura (não conhece React)
│   ├── storage.js          # Camada de persistência (localStorage)
│   ├── etapas.js           # Etapas fixas de onboarding
│   └── clientes.js         # Regras de negócio (status, progresso)
├── context/
│   └── ClientesContext.jsx # Provider + hook useClientes()
├── components/
│   └── Layout.jsx
└── pages/
    ├── Dashboard.jsx       # Lista de clientes com progresso
    ├── NovoCliente.jsx     # Formulário de cadastro
    └── DetalheCliente.jsx  # Detalhe + checklist (em construção)
```

### Princípio: separação de camadas

Componentes consomem dados via `useClientes()` e **não sabem** que existe
localStorage. Trocar por Supabase no futuro é mudar dois arquivos:
`lib/storage.js` (escrita/leitura) e `context/ClientesContext.jsx`
(possivelmente async). O resto da aplicação não muda.

## Status atual

- ✅ Cadastro de clientes (Etapa 1)
- 🚧 Checklist de onboarding (Etapa 2) — em construção
- 🚧 Filtro por consultor no dashboard (Etapa 3) — em construção
- 🚧 Diário de uso da IA (Etapa 4) — em construção

## Diário de uso da IA

_Será preenchido conforme o desenvolvimento avança._
