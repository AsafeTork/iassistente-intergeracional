Skill 4 — Réplica fiel de design systems governamentais
---
name: replica-design-system-governamental
description: Reproduz padrões visuais e comportamentais de interfaces governamentais com alta fidelidade, preservando hierarquia, semântica, acessibilidade e consistência institucional sem inventar componentes ou comportamentos incompatíveis.
---

# Diretrizes

- Trate o design system oficial como fonte de verdade quando disponível.
- Não substitua padrões institucionais por tendências visuais arbitrárias.
- Preserve nomenclatura, hierarquia e comportamento dos componentes.
- Reproduza estados: default, hover, focus, active, disabled, loading e error quando existirem.
- Preserve espaçamentos, grids, tipografia e proporções do sistema de referência.
- Não altere uma interação institucional apenas para deixá-la “mais bonita”.
- Diferencie claramente elementos pertencentes ao serviço governamental dos elementos próprios do IAssistente.
- A camada de IA deve orientar o usuário sem criar falsa aparência de que ela é o próprio órgão governamental.
- Não invente logotipos, selos, certificados ou indicadores oficiais.
- Não apresente uma interface simulada como sendo uma página oficial real.
- Use componentes equivalentes em CSS/React quando a implementação original não estiver disponível.
- Preserve comportamento responsivo.
- Preserve acessibilidade e foco de teclado.
- Documente qualquer adaptação visual necessária para o contexto assistivo.

## Estrutura recomendada

Separar visualmente:

- `GovernmentUI`: interface e padrões do serviço público.
- `AssistantUI`: orientação, voz, destaques e feedback do IAssistente.
- `DemoUI`: elementos exclusivos da demonstração.

## Regra de fidelidade

A réplica deve preservar o que o usuário precisa reconhecer para confiar e se orientar, mas não deve criar confusão sobre quem presta o serviço.

## Critério de qualidade

O usuário deve conseguir distinguir imediatamente:

“Estou no serviço governamental”

de

“O IAssistente está me ajudando a usar esse serviço”.
