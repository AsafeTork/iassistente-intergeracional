---
name: glass-premium-acessivel
description: Glassmorphism premium com fallback de acessibilidade para idosos — regras acionáveis de blur, contraste, foco e degradação graciosa sem backdrop-filter.
---

Novo chat
Buscar chats
Imagens
Plugins
Investigação
Confira planos e preços
Configurações
Ajuda
Receba respostas personalizadas para você

Entre para receber respostas com base em chats salvos, além de criar imagens e carregar arquivos.

Entrar
ChatGPT
Entrar
Cadastre-se grátis
Você disse:

Me dê UMA skill SKILL.md completa (front-matter name=glass-premium-acessivel + description, depois diretrizes acionáveis numeradas) de glassmorphism premium com fallback de acessibilidade para idosos. Só isso, direto ao ponto.

O ChatGPT disse:
SKILL.md
name: glass-premium-acessivel
description: Cria interfaces de glassmorphism premium, sofisticadas e legíveis, com fallback de acessibilidade especialmente robusto para pessoas idosas, baixa visão e limitações cognitivas ou motoras.
Diretrizes

Priorize legibilidade sobre estética. Use glassmorphism como camada visual, nunca como requisito que prejudique compreensão, contraste ou navegação.

Aplique vidro com moderação. Prefira background translúcido, backdrop-filter: blur() moderado, bordas sutis e sombras suaves. Evite excesso de transparência, blur intenso ou empilhamento de superfícies translúcidas.

Mantenha contraste suficiente. Texto, ícones e controles devem permanecer claramente distinguíveis do fundo. Quando o contraste cair, aumente a opacidade da superfície ou remova o efeito de vidro.

Use fallback sólido acessível. Para contextos incompatíveis ou de baixa legibilidade, substitua automaticamente o vidro por uma superfície opaca ou quase opaca, mantendo a hierarquia visual.

Respeite prefers-reduced-transparency. Quando disponível, desative transparência e blur e use fundos sólidos:

@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: #fff;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}


Respeite prefers-reduced-motion. Não dependa de animações, parallax ou transições para comunicar estado. Reduza ou remova movimento quando solicitado.

Projete para idosos primeiro. Use tipografia confortável, espaçamento generoso, controles grandes e estados visuais inequívocos. Evite interfaces excessivamente compactas ou decorativas.

Use tamanhos de toque confortáveis. Áreas interativas devem ser grandes o suficiente para reduzir erros de toque e não depender de precisão motora fina.

Não use translucidez para codificar informação. Estados importantes — erro, sucesso, alerta, seleção, foco ou desabilitado — devem ser identificáveis também por texto, forma, ícone ou borda.

Garanta foco visível. Todo elemento interativo deve apresentar um indicador de foco claro e suficientemente contrastante, sem depender apenas do brilho ou da sombra do glassmorphism.

Não dependa apenas de cor. Diferencie estados por múltiplos sinais visuais e textuais, especialmente em interfaces para baixa visão ou daltonismo.

Evite fundos visualmente ruidosos. Sobre fotografias, gradientes complexos ou imagens, coloque uma camada de contraste antes da superfície de vidro. Se ainda houver perda de legibilidade, use fallback sólido.

Preserve hierarquia visual simples. Limite a quantidade de níveis de cartões, painéis e modais translúcidos. A superfície mais importante deve ser visualmente dominante.

Use tipografia acessível. Prefira fontes simples, pesos bem definidos, altura de linha confortável e tamanhos que permaneçam legíveis quando o usuário ampliar o texto.

Permita zoom e redimensionamento. Nunca impeça recursos nativos do navegador ou do sistema que ampliem conteúdo.

Evite texto sobre vidro altamente transparente. Para conteúdo longo, formulários, instruções ou mensagens críticas, prefira superfícies opacas ou de alta opacidade.

Trate o modo de alto contraste como prioridade. Se o sistema ou navegador solicitar maior contraste, simplifique ou remova efeitos decorativos e preserve apenas bordas, fundos e textos claramente distinguíveis.

Mantenha estados de interação explícitos. Hover, foco, pressionado, selecionado, carregando, erro e sucesso devem ter diferenças perceptíveis sem depender de efeitos sutis.

Garanta fallback tecnológico. Se backdrop-filter não estiver disponível, a interface deve continuar funcional e visualmente coerente usando um fundo sólido:

.glass {
  background: rgba(255, 255, 255, 0.72);
}

@supports (backdrop-filter: blur(1px)) {
  .glass {
    background: rgba(255, 255, 255, 0.48);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
}


Separe estética de semântica. O efeito glass deve ser puramente visual; estrutura HTML, nomes acessíveis, labels, mensagens de erro e navegação por teclado devem funcionar sem ele.

Prefira sombras discretas. Use sombra para criar profundidade, não para substituir contraste de borda ou indicar estado de interação.

Evite efeitos que simulem iluminação excessiva. Brilhos, reflexos, gradientes e bordas luminosas devem ser secundários e nunca competir com conteúdo ou controles.

Teste com baixa visão. Verifique a interface com zoom elevado, aumento de fonte, contraste elevado e diferentes níveis de brilho. Se qualquer efeito comprometer a leitura, reduza-o ou remova-o.

Forneça um modo acessível explícito quando apropriado. Interfaces complexas podem oferecer uma alternativa “Alto contraste / Visual simplificado” que elimina transparência, blur e ornamentação sem remover funcionalidades.

Defina uma regra de degradação. Sempre que houver conflito entre glassmorphism e acessibilidade, aplique esta ordem: conteúdo > legibilidade > interação > acessibilidade > estética > efeitos decorativos.

Valide antes de entregar. Confirme contraste, foco, teclado, zoom, tamanho dos controles, leitura em fundos variados, ausência de dependência de cor/movimento/transparência e funcionamento sem backdrop-filter.

Resultado esperado. A versão premium deve parecer sofisticada e leve; a versão de fallback deve parecer deliberadamente limpa e confiável — nunca uma versão “quebrada” ou desprovida de design.
