# Central de Onboarding · Maiver

Ferramenta interna para gerenciar o onboarding de novos clientes Maiver. MVP construído como entrega do **desafio Vibe Coding**, usando React + Vite + Tailwind, com IA como copiloto principal.

Antes de tudo gostaria de destacar que me desafiei em tentar fazer esse desafio no máximo em 2 horas.
O Tempo total gasto foi de 1 hora e 56 minutos.

🔗 **Aplicação rodando:** [https://vercel.com/thalesabdons-projects/maiver-desafio-vibe-coding-frontend](https://https://vercel.com/thalesabdons-projects/maiver-desafio-vibe-coding-frontend) *(substitua pela sua URL real)*
📓 **Diário de uso da IA:** [DIARIO-IA.md](./DIARIO-IA.md)

---

## Funcionalidades

### Cadastro de clientes
- Formulário com validação em tempo real (após o primeiro `blur`)
- Telefone com regex BR + internacional (suporta DDI e DDD)
- Bloqueio silencioso de números no campo Responsável
- Consultor selecionado entre 5 opções fixas

### Checklist de onboarding
- 6 etapas fixas predefinidas, criadas automaticamente no cadastro
- Toggle de conclusão com timestamp
- Notas opcionais por etapa
- Apenas o consultor responsável pelo cliente pode editar (pseudo-login)

### Dashboard
- Lista de todos os onboardings com progresso e status visual
- Status: **Em andamento** / **Concluído** / **Atrasado** (>30 dias sem conclusão)
- Busca por consultor com normalização de acentos
- Estados vazios com call-to-action

---

## Como rodar localmente

Pré-requisitos: **Node 18+** e **npm**.

```bash
git clone https://github.com/ThalesAbdon/MAIVER---Desafio-Vibe-Coding---Frontend.git
cd MAIVER---Desafio-Vibe-Coding---Frontend
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

---

## Stack

| Tecnologia       | Por quê                                              |
|------------------|------------------------------------------------------|
| React 18 + Vite  | DX rápida, hot reload instantâneo                    |
| Tailwind CSS     | Estilização utilitária, prompts pra IA determinísticos |
| React Router     | 3 rotas client-side                                  |
| localStorage     | Persistência sem backend, zero setup                 |
| uuid             | IDs imunes a colisão                                 |

---

## Arquitetura

```
src/
├── lib/                # Lógica pura (sem React)
│   ├── storage.js      # Acesso ao localStorage
│   ├── clientes.js     # Regras de negócio (progresso, status)
│   ├── etapas.js       # Etapas fixas de onboarding
│   ├── validators.js   # Validações de formulário
│   ├── format.js       # Formatação de datas
│   └── consultores.js  # Lista de consultores
├── context/            # Estado global
│   ├── ClientesContext.jsx
│   └── ConsultorAtualContext.jsx
├── components/
│   ├── Layout.jsx
│   ├── BadgeStatus.jsx
│   └── TelaEntrada.jsx
└── pages/
    ├── Dashboard.jsx
    ├── NovoCliente.jsx
    └── DetalheCliente.jsx
```

**Princípio orientador: separação de camadas.** Componentes consomem dados via `useClientes()` e não sabem que existe localStorage. Trocar por backend de verdade (Supabase, REST) significa alterar 2 arquivos; o resto da aplicação não toca.

---

## Capturas de tela

> *Coloque os PNGs em uma pasta `screenshots/` na raiz e ajuste os caminhos abaixo.*

| Tela | Captura |
|------|---------|
| Entrada (escolha do consultor) | ![Entrada](./screenshots/01-entrada.png) |
| Dashboard com busca | ![Dashboard](./screenshots/02-dashboard.png) |
| Cadastro com validação | ![Cadastro](./screenshots/03-cadastro.png) |
| Detalhe + checklist | ![Detalhe](./screenshots/04-detalhe.png) |
| Read-only para outros consultores | ![Read-only](./screenshots/05-readonly.png) |

---

## Estrutura de dados

Clientes são armazenados em `localStorage` sob a chave `maiver:clientes`:

```json
{
  "id": "uuid-v4",
  "empresa": "Acme Inc",
  "responsavel": "Maria Silva",
  "email": "maria@acme.com",
  "telefone": "+55 11 99999-9999",
  "plano": "Pro",
  "dataInicio": "2025-05-19",
  "consultor": "Fernando",
  "etapas": [
    {
      "id": "kickoff",
      "nome": "Reunião de kickoff realizada",
      "concluida": true,
      "nota": "Reunião de 1h com toda a liderança.",
      "concluidaEm": "2025-05-20T14:32:00Z"
    }
  ],
  "criadoEm": "2025-05-19T10:00:00Z"
}
```

A identidade do consultor "logado" fica em `maiver:consultor_atual`.

---

## Limpar dados de teste

No console do navegador:

```js
localStorage.clear()
```

Ou via DevTools: **Application → Local Storage → Clear**.

---

## Decisões e trade-offs

- **localStorage em vez de backend.** Suficiente pro MVP, encapsulado de modo que migrar pra Supabase/REST seja barato. Limitação assumida: dados são por-browser-por-usuário, não compartilhados.
- **Pseudo-login em vez de auth real.** O desafio explicitamente dispensa autenticação, mas o requisito "o consultor responsável deve conseguir marcar etapas" sugere algum tipo de gating. A solução é um picker de identidade transparente, documentado claramente como **workflow, não segurança**.
- **Etapas fixas no código.** O desafio permite. Tornar configurável adicionaria complexidade sem valor agregado pro MVP.

A reflexão completa sobre essas decisões — e o processo de construir com IA — está em [DIARIO-IA.md](./DIARIO-IA.md).