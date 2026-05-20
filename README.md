# Central de Onboarding · Maiver

Ferramenta interna para gerenciar o onboarding de novos clientes Maiver. MVP construído como entrega do **desafio Vibe Coding**, usando React + Vite + Tailwind, com IA como copiloto principal.

Antes de tudo gostaria de destacar que me desafiei em tentar fazer esse desafio no máximo em 2 horas.
O Tempo total gasto foi de 1 hora e 56 minutos.

🔗 **Aplicação rodando:** [https://maiver-desafio-vibe-coding-frontend.vercel.app/](https://maiver-desafio-vibe-coding-frontend.vercel.app/)
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

| Tela | Captura |
|------|---------|
| Entrada (escolha do consultor) | <img width="500" alt="Tela de entrada" src="https://github.com/user-attachments/assets/1341da0c-18f4-4e45-9db9-a7ffed5ce1af" /> |
| Dashboard com busca | <img width="500" alt="Dashboard" src="https://github.com/user-attachments/assets/0fee87dd-2c37-4234-8856-9725171f5d97" /> |
| Cadastro com validação | <img width="500" alt="Cadastro" src="https://github.com/user-attachments/assets/67220873-4725-4a1d-b87c-dd7b7f540b7d" /> |
| Detalhe + checklist | <img width="500" alt="Detalhe do cliente" src="https://github.com/user-attachments/assets/4a1ae8e8-131d-4e1d-a009-63502f5e2c58" /> |
| Read-only para outros consultores | <img width="500" alt="Aviso de read-only" src="https://github.com/user-attachments/assets/4d2054b7-887c-4528-8726-396f2754c737" /> |

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
