# UX & Onboarding — Xikota Express

Visão geral
- Objetivo: capturar briefing mínimo e validar dados para gerar `DesignTokens` confiáveis. Experiência premium: direta, previsível, sem ruído.

Fluxo (etapas)
1. Escolha de pacote (Step 1)
   - Opções: `Identidade Visual`, `Landing Page`, `Material Social`, `App / UI`.
   - UI: botões grandes com descrição; selecção única.
2. Contexto do Negócio (Step 2)
   - Textarea obrigatória; mínimo 50 caracteres; contador dinâmico; placeholder exemplos.
   - Validação: desabilita botão Avançar até atingir 50 chars. Mensagem inline: "Detalhe mais para avançar." com ícone de aviso.
3. Direção de Arte (Step 3)
   - Vibes semânticos: Minimalista, Ousado, Corporativo, Divertido.
   - Seleção afeta prompt LLM (`meta.vibe`).
4. Paleta Base (Step 4)
   - Paletas pre-validadas (acessibilidade); cada opção exibe swatches; armazena token keys.
5. Referências (Step 5)
   - Input URL(s) validados por regex `^https?://`.
   - Opcional: botão "Pular" disponível.
6. Processamento (Step 6)
   - Tela de 7s dividida em fases: 1) Sintetizando Briefing (0–2.5s) 2) Gerando Workspace (2.5–5s) 3) Finalizando (5–7s).
   - Animação de progresso linear; aria-live status updates para screen readers.
7. Pagamento e Sucesso
   - Stripe Checkout entre processamento final e sucesso.
   - Only show Success screen after Stripe webhook confirms payment.

Microinteractions e regras
- Botão Avançar: bloqueado até validações satisfeitas; estilo `disabled:opacity-40`.
- Voltar: botão ArrowLeft disponível em Steps 2–6.
- Click feedback: border black activation in 300ms to indicate press acknowledged.
- Errors: client-side validation first; server returns structured errors `{ code, field, message }`.
- Accessibility: all interactive controls keyboard reachable; focus ring visible; reduced-motion support via `prefers-reduced-motion`.

Validations (summary)
- `type` required (string)
- `description` required, string, minLength: 50
- `vibe` required (one of pre-defined)
- `colors` must be one of allowed palettes or valid hex array
- `references` optional, each must match `^https?://`

Microcopy (examples)
- Step 2 placeholder: "Ex: Plataforma B2B SaaS para gestão logística..."
- Validation hint: "Mínimo 50 caracteres para gerar um briefing técnico útil."
