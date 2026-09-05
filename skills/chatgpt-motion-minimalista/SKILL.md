name: motion-minimalista-react
description: Define microinterações e animações acessíveis em React usando CSS e APIs nativas do navegador, sem bibliotecas externas de motion.
---

# Diretrizes

- Use CSS transitions e keyframes como primeira opção.
- Use React apenas para controlar estados e classes.
- Evite animações decorativas contínuas.
- Toda animação deve comunicar estado, hierarquia ou causalidade.
- Prefira transform e opacity por desempenho.
- Evite animar propriedades que provoquem layout quando não for necessário.
- Mantenha transições curtas e previsíveis.
- O destaque do passo atual deve chamar atenção sem piscar.
- A presença da IA pode flutuar suavemente, mas nunca competir com o CTA principal.
- Use animações para estados: `listening`, `thinking`, `guiding`, `success` e `error`.
- Não use movimento como única indicação de estado.
- Forneça estado visual estático equivalente.

## Acessibilidade

Sempre implemente:

css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

React
Prefira:
<div className={`assistant ${isListening ? 'is-listening' : ''}`}>

em vez de introduzir uma biblioteca de animação apenas para transições simples.
Critério de qualidade
Se a animação for removida, o usuário ainda deve compreender exatamente o que aconteceu e qual é o próximo passo.
