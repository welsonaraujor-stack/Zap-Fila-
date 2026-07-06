# Zap-Fila-
Fila de carregamento para carros elétricos

# ⚡ EV Charge Queue — Gerenciamento de Carregamento de Veículos Elétricos

Sistema de gestão de fila, agendamento e carregamento de veículos elétricos, pensado para dois cenários de uso: **condomínios** (com aviso à portaria) e **postos públicos/comerciais**.

## Status do projeto

🚧 **Protótipo funcional (frontend puro)** — HTML, CSS e JS vanilla, sem backend/persistência ainda. Atualmente implementa apenas o fluxo básico de fila de um único posto (sem múltiplos pontos simultâneos, sem agendamento e sem o modo Condomínio/porteiro). Essas features estão especificadas e prontas para implementação — ver seção [Regras de Negócio](#regras-de-negócio).

## Visão geral

O app organiza o ciclo de vida completo de um atendimento de carregamento:

```
Agendamento → Entrega (check-in) → Carregamento → Conclusão → Saída (retirada)
```

- **Modo Condomínio:** ao concluir a carga, o sistema avisa o porteiro, que liga para o apartamento do morador. A saída é confirmada pelo porteiro.
- **Modo Posto:** a notificação vai direto para o cliente (push/SMS). A saída é confirmada pelo próprio cliente ou pelo operador.

## Funcionalidades atuais (protótipo)

- Cadastro manual de veículo (placa, modelo, % de bateria, tempo estimado de carga)
- Simulação de chegada de veículo aleatório
- Fila com status: **Na fila** → **Carregando** → **Concluído**
- Progresso de carga simulado automaticamente (`setInterval`, incrementos a cada segundo)
- Painel com estatísticas: veículos na fila, carregando, concluídos hoje, tempo médio
- Modal de cadastro de novo veículo

## Funcionalidades planejadas

- [ ] Suporte a múltiplos pontos de carregamento simultâneos (hoje o sistema não diferencia "tomadas")
- [ ] Agendamento por horário fixo, com validação de conflito e tolerância de atraso
- [ ] Modo Condomínio: vínculo morador ↔ apartamento e notificação ao porteiro
- [ ] Modo Posto: notificação direta ao cliente (push/SMS)
- [ ] Confirmação explícita de conexão física antes de iniciar o carregamento
- [ ] Status intermediário "Aguardando retirada" (carga concluída, veículo ainda no local)
- [ ] Persistência de dados (banco de dados / backend)
- [ ] Autenticação e perfis de usuário (Motorista/Morador, Porteiro, Administrador, Operador)

## Estrutura do projeto

```
├── index.html      # Estrutura da página (dashboard, fila, modal de cadastro)
├── styles.css      # Tema escuro, cards, badges de status, responsivo
└── script.js       # Lógica de estado, renderização e simulação da fila
```

### Principais elementos do `script.js`

| Função | O que faz |
|---|---|
| `render()` | Redesenha todo o painel a partir do estado atual (`state.cars`) |
| `addCar()` | Adiciona veículo via formulário do modal |
| `simulateArrival()` | Gera um veículo aleatório para teste |
| `startNext()` | Move o primeiro veículo da fila para "Carregando" |
| `finishCurrent()` | Marca o primeiro veículo "Carregando" como "Concluído" |
| `tickProgress()` | Incrementa o progresso de carga a cada segundo |

> ⚠️ **Limitação conhecida:** `startNext()` e `finishCurrent()` não fazem referência a um ponto de carregamento específico — não há controle de quantos veículos podem carregar ao mesmo tempo. Isso está descrito em detalhe (com regras de correção) no documento de Regras de Negócio.

## Como rodar

Não há dependências ou build — é só abrir o arquivo:

```bash
# opção 1: abrir direto no navegador
open index.html

# opção 2: servidor local simples (recomendado, evita restrições de CORS/dialog)
npx serve .
```

## Regras de Negócio

O comportamento completo esperado do sistema (agendamento, capacidade de fila, notificação ao porteiro, permissões por perfil de usuário, casos de borda) está documentado em:

📄 `Regras_de_Negocio_EV_Charging.docx`

## Autor

Welson Araujo
