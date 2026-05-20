# Diário de Uso da IA

Documento da **Etapa 4** do desafio Vibe Coding. Reflete o processo real de construção da Central de Onboarding usando IA como copiloto principal.

---

## 1. Quais ferramentas de IA você usou e por quê?

**Ferramenta principal:** Claude (Opus), via [claude.ai](https://claude.ai) no navegador.

Escolhi Claude por quatro motivos:

1. **Diálogo arquitetural antes do código.** Pra um MVP novo, a fase de "definir camadas, modelo de dados e padrões" rende mais quando é conversa, não autocompletion. Claude consegue justificar trade-offs, não só gerar código.
2. **Geração de código longo coerente.** Componentes inteiros (uns 200 linhas), com comentários relevantes, sem perder contexto do que veio antes.
3. **Capacidade de revisar e refatorar.** Quando precisei extrair `BadgeStatus`, ele entendeu o "por que extrair", não só o "como".
4. **Projeto pequeno.** Sem necessidade de utilização de vários agentes.

**O que não usei (e por quê):**
- **Cursor / Windsurf:** ferramentas inline são ótimas pra completar a próxima linha. Não era o que eu precisava nessa fase — estava decidindo arquitetura, não datilografando.
- **GitHub Copilot:** mesmo motivo. Útil pra produtividade depois que o esqueleto está pronto.
- **ChatGPT:** poderia ter comparado, mas em projetos anteriores Claude me deu respostas mais densas em contexto de arquitetura. Não fiz benchmark formal nessa sessão.

**Ambiente:** WSL2 (Ubuntu) sobre Windows, Node 24 LTS via nvm, VS Code com WSL Remote.

---

## 2. Prompts e o que a IA gerou

### Prompt 0 - Inicial

> *"Vou te passar um desafio técnico de "vibe coding". Quero construir um MVP usando você como copiloto principal — meu trabalho é dirigir e validar, o seu é executar e justificar.

CONTEXTO:
- Desenvolvedor [iniciante/intermediário/sênior]
- Ambiente: WSL2 + Ubuntu, Node 18+, VS Code
- Stack preferida: React + Vite + Tailwind (mas aberto a sugestões justificadas)
- Prazo: 3 dias corridos
- A avaliação inclui código E processo de uso da IA — vou documentar nossa colaboração depois

DESAFIO COMPLETO:
[colar o PDF/documento aqui]

COMO QUERO COLABORAR:
1. Antes de qualquer código, discutimos arquitetura: camadas, modelo de dados, padrão de estado, persistência. Apresenta opções com justificativa.
2. Trabalhamos em fatias verticais — cada funcionalidade inteira funcionando antes de partir pra próxima.
3. Justifica decisões. Quando houver trade-off real (complexidade vs simplicidade, performance vs legibilidade), apresenta as opções e me deixa escolher.
4. Se eu pedir algo que pareça overkill pro escopo, me questiona antes de implementar.
5. Separação de camadas: lógica pura em /lib (sem React), estado em /context, UI em /pages e /components. Componentes não devem saber qual é a persistência subjacente.
6. Comentários no código apenas onde a intenção não fica óbvia pelo nome de variável/função.
7. Quando eu mostrar erros, pede a saída específica que vai te ajudar a diagnosticar (não chute).

ENTREGA:
- Arquivos novos ou refatorações grandes: arquivo inteiro num bloco de código
- Mudanças cirúrgicas: indica o trecho a substituir
- No fim de cada entrega, lista as decisões não-óbvias ("por que extraí X", "por que usei Set em vez de objeto")

PRIMEIRO PASSO:
Apresenta 3-4 decisões arquiteturais que precisamos fechar antes de qualquer scaffold (roteamento, estilização, estado, persistência). Pra cada uma: opções, sua recomendação, justificativa. Depois discutimos modelo de dados. Só então escrevemos código."*

### Prompt 1 — Filtro digitado no Dashboard

> *"ACHO QUE O FILTRO PODERIA SER PELO NOME (DIGITADO) pq com 5 é ok... mas e se tiverem 100 consultores?"*

**O que a IA gerou:** Reescreveu o `Dashboard.jsx` substituindo as pills clicáveis por input de busca com substring match. Importante — ela foi além do pedido e adicionou normalização de acentos via `String.prototype.normalize('NFD')`:

```js
function normalizar(str) {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
```

Isso significa que "jose" encontra "José". Algo que eu nem tinha pensado em pedir mas é crucial em UI brasileira.

**Funcionou de primeira?** Sim. A IA também sugeriu adicionar uma lupa SVG inline em vez de instalar `lucide-react` (justificativa: "11 linhas resolvem, evita 100KB de bundle"). Concordei.

**Lição:** o ganho de pedir uma feature simples pra IA muitas vezes está nos detalhes que ela adiciona sem você pedir — desde que você revise.

---

### Prompt 2 — Validação em tempo real + bloqueio de números

> *"Não tem como ter um warning em tempo real? ou impedir que digite números no Responsável de contato?"*

**O que a IA gerou:** Implementou os dois padrões — **bloqueio silencioso** no Responsável (números desaparecem na hora) e **validação live após primeiro `blur`** em todos os outros campos. Explicou que validar desde a primeira tecla é hostil (você digita "M" e leva "obrigatório") e que o padrão profissional é "touched + dirty" — o mesmo que React Hook Form e Formik fazem por baixo.

**Funcionou de primeira?** Quase. A primeira versão tinha um bug sutil: quando o erro era limpado (`null`), o `if (erros[campo])` virava falsy e a live validation parava de funcionar até o próximo blur. A IA refatorou pra usar `Set` separado de `touched`:

```jsx
const [tocados, setTocados] = useState(new Set())
```

E me alertou pra um pitfall: pra React detectar mudança no Set, **precisa criar Set novo**, não mutar (`setTocados(prev => new Set(prev).add(campo))`).

**Lições:**
- Sanitização no `onChange` antes do `setState` é mais robusta que `onKeyDown` com `preventDefault` — funciona pra paste, drag-drop, autocomplete do navegador.
- `\p{L}` com flag `/u` no regex pega qualquer letra Unicode (inclusive acentos). Bem mais limpo que `[a-zA-ZÀ-ÿ]`.

---

### Prompt 3 — Pseudo-login por consultor

> *"Quero fazer login para os consultores, para podermos validar a etape 2 e 3 do desafio"*

**O que a IA gerou:** Primeiro, **questionou o pedido.** O desafio diz "não é necessário autenticação", então a IA propôs um "seletor de identidade" honesto em vez de implementar auth real (senhas, sessões, JWT). A solução final foi:

1. `ConsultorAtualContext` que persiste a identidade em `localStorage`
2. Tela de entrada que aparece quando não há consultor "logado"
3. Header mostrando "Logado como X" com botão "trocar"
4. Em `DetalheCliente`, gate por `cliente.consultor === consultorAtual`

**Funcionou de primeira?** Sim. O detalhe que poderia ter quebrado e a IA preveniu: adicionou `if (!podeEditar) return` dentro das funções `alternarEtapa` e `alterarNota` mesmo com a UI já desabilitando os controles. Comentário no código:

```js
// Defesa em profundidade — UI nunca deve ser a única barreira.
```

**Lição:** quando o que você pede pode ser interpretado como overkill, vale a IA discutir o trade-off antes de simplesmente entregar. Economizou tempo e me deu justificativa pra defender a decisão.

---

## 3. Qual parte do MVP foi mais difícil de construir com IA? Como resolvi?

**Configuração do ambiente (WSL + Node + VS Code).**

Coisa que parecia simples virou vinte minutos de troubleshooting:

- **VS Code dando "Exec format error"** ao abrir do WSL. Diagnóstico: WSL interop desabilitado. Solução: configurar `/etc/wsl.conf` com seção `[interop]`.
- **Node não instalado por padrão.** A IA recomendou nvm em vez de `apt install nodejs` (a versão do apt geralmente fica defasada).
- **Arquivo `format.js` faltando** depois que paramos de trocar zips. A IA tinha assumido que eu estava aplicando todas as atualizações, mas eu estava editando manualmente. Build quebrou no Vite. Solução: rodar `find src -type f | sort` pra confirmar o estado real do filesystem.

**Por que foi mais difícil:** a IA não pode rodar comandos no meu terminal — então cada erro virava "cola a saída aqui pra eu analisar". O ciclo de feedback é mais lento que código onde ela vê o resultado direto.

**Como resolvi:** confiar nos diagnósticos da IA quando ela pedia info específica (ex.: "roda `cat /proc/sys/fs/binfmt_misc/WSLInterop`"), em vez de tentar adivinhar a causa eu mesmo.

---

## 4. O que escolhi não construir (ou simplificar) para entregar no prazo? Por quê?

- **Backend / banco de dados.** localStorage é suficiente pro MVP. Encapsulei o acesso em `lib/storage.js`, então trocar por Supabase no futuro é mudar um arquivo. Custo assumido: dados não são compartilhados entre browsers/usuários.
- **Autenticação real.** O desafio explicitamente dispensa. Construí pseudo-login pra simular o gating "só o consultor responsável edita", documentado claramente que não é segurança.
- **Testes automatizados.** As funções em `lib/clientes.js` e `lib/validators.js` são puras — perfeitas pra Vitest. Não escrevi pra entregar no prazo. Trade-off claro: economizei 1-2h, sacrifiquei confiança em refactors futuros.
- **Responsividade mobile.** Testei só em desktop. O layout não deve quebrar feio, mas não dei polimento.
- **Configurabilidade das etapas.** O desafio permite serem fixas. Não vale a complexidade extra pro MVP.

---

## 5. O que faria diferente se tivesse mais tempo?

Em ordem de prioridade:

1. **Testes unitários pra `lib/`.** Validators e regras de negócio são funções puras. 30 minutos de Vitest cobririam 80% dos bugs possíveis em refactors futuros.
2. **Backend mínimo (Supabase).** Pra dados compartilhados entre consultores. Mantendo a interface de `lib/storage.js`, a mudança seria pontual.
3. **Histórico de mudanças por etapa.** Hoje só gravo `concluidaEm`. Útil seria um log: "Fernando marcou kickoff em 19/05 às 14:32, desmarcou em 20/05 às 09:15".
4. **Refinamento mobile.** Pelo menos garantir que o checklist no detalhe não fique apertado em telas <380px.
5. **Notificações de atraso.** Cliente com onboarding entre 25-30 dias poderia gerar um aviso visual ("perto de atrasar"), pra trazer ação antes do problema acontecer.
6. **Comparar Claude vs GPT vs Cursor pro mesmo prompt.** Pra entender qual ferramenta brilha em qual fase do desenvolvimento.

---

## Observação final sobre o workflow

Algo que percebi sobre o meu uso de "vibe coding": foi mais **diálogo arquitetural** do que **prompt crafting**. Não escrevi prompts cuidadosamente formatados — fiz pedidos diretos, em português, conversacionais, e respondi as perguntas que a IA me fazia com clareza.

Funcionou porque eu sabia o que queria de cada fatia (cadastro → checklist → dashboard → login) e tinha critério pra revisar o código gerado. Inclusive achei um bug que eu mesmo tinha introduzido — em algum momento mudei `< 2` pra `< 1` em `validarEmpresa` por engano, e só percebi na hora de revisar o diff pra abrir o PR.

A lição que levo: **IA acelera quem já tem critério.** Quem não tem critério recebe um monte de código que parece OK até quebrar.