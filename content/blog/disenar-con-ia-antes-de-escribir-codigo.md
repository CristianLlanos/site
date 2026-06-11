---
title: "Diseñar con IA antes de escribir código: el método /spec"
date: "2026-06-11T12:00:00.000Z"
description: "El método /spec: usa IA para diseñar proyectos, features y refactors —y dejar las decisiones por escrito— antes de escribir código."
image: "/img/og/disenar-con-ia-antes-de-escribir-codigo.png"
---

${toc}

## La IA que escribe código no es la parte difícil

Casi todo el ruido sobre IA en desarrollo gira alrededor de lo mismo: generar código. Y está bien, ayuda. Pero si miro hacia atrás, los errores caros de un proyecto casi nunca fueron *código malo* — fueron **decisiones que nadie escribió**.

Abres tu propio repositorio tres meses después y te preguntas: *"¿por qué lo hice así?"*. La decisión existió. Simplemente se evaporó. Y con agentes de IA el problema se agudiza, porque un agente **no tiene memoria entre sesiones**: si no externalizas la decisión, la vuelve a tomar desde cero — y distinto.

> Di una charla en vivo sobre esto: **[Decisiones conscientes](/slides/decisiones-conscientes/)**. Este artículo es la versión escrita del método que muestro ahí.

## Qué es `/spec`

`/spec` es un skill de [Claude Code](https://www.claude.com/product/claude-code) que ejecuta una **conversación de diseño estructurada antes de escribir una sola línea de código**. Su filosofía cabe en una frase:

> El diseño es una conversación, no un documento.

En la práctica eso significa tres cosas:

- **Presenta opciones con tradeoffs y una recomendación — tú decides.** No te entrega un menú cerrado; te muestra el panorama y te deja elegir.
- **Corta sin piedad.** Cada feature tiene que ganarse su lugar. *"¿De verdad lo necesitamos?"* es siempre una pregunta válida.
- **No escribe código.** Solo diseña. La implementación ocurre en una sesión aparte, guiada por lo que `/spec` produjo.

## El flujo

Es una conversación guiada, **un tema a la vez** — nada de volcar todo de golpe. A grandes rasgos:

1. **Restricciones y prior art** — lo que condiciona cada decisión: geografía, presupuesto, infra que ya tienes, cómo se despliega. No avanza hasta tenerlas claras.
2. **Visión, audiencia y pitch de una frase** — si no lo dices en una frase, la visión todavía no está clara.
3. **Stack** — 3–4 opciones con pros y contras, una recomendación, tú eliges.
4. **Features y diseño del sistema** — listar candidatos, cortar lo que no aporta, y organizar en fases: MVP · alto valor · nice-to-have.
5. **Gut check** — ¿la visión sigue en pie después de diseñar?
6. **Arquitectura y comportamiento** — tipos, edge cases, decisiones técnicas.
7. **Reconciliación operativa** — build, deploy, costos; re-chequear cada decisión contra la realidad.
8. **Documentar y handoff** — escribir los artefactos, auto-auditarse, y verificar que una sesión nueva podría implementar el paso 1 sin preguntar nada.

## Cómo encaja en tu workflow

Lo bueno es que el mismo método se adapta a los tres momentos en los que de verdad lo necesitas.

### Proyecto nuevo

Corre todas las fases: nombras el proyecto, eliges stack con tradeoffs y sales con un **ROADMAP por fases** y un **CLAUDE.md** que un agente puede tomar y ejecutar paso a paso. En vez de "empecemos a codear y vemos", arrancas con un plan que ya sopesó las alternativas.

### Feature nueva

Salta la elección de stack y se enfoca en encajar la feature en el producto que ya existe. Añade las nuevas decisiones a `DECISIONS.md` y actualiza el ROADMAP. El *gut check* y el self-audit evitan el clásico "feature que no termina de calzar": si choca con algo ya decidido, lo detecta antes de que llegue al código.

### Refactor o pivot

Lee los docs existentes, reescribe ROADMAP y ARQUITECTURA, y **marca las decisiones superadas** en lugar de borrarlas. Acá está el mayor ahorro: no vuelves a discutir lo ya decidido, porque `DECISIONS.md` guarda el porqué — y lo que rechazaste en su momento.

## Lo que deja por escrito

Al final, `/spec` produce un set de documentos pensado para que una sesión futura implemente sin contexto previo: `ROADMAP.md`, `CLAUDE.md`, `PROGRESS.md`, `docs/ARCHITECTURE.md` y — el más importante — `docs/DECISIONS.md`.

El formato de las decisiones es lo que las hace útiles: **Decidido / Por qué / Rechazado**.

```markdown
## 002 · Enmascarado de secretos

Decidido:  convención + flag explícito del usuario.

Por qué:   la convención cubre el 90% de los casos;
           el flag maneja las excepciones.

Rechazado: ✗ sin máscara (maneja API keys a diario)
           ✗ solo convención (no enmascara nombres raros)
           ✗ solo explícito (la gente olvida marcarlo)
```

El oro está en **Rechazado**: preserva los caminos que no tomaste y por qué. Eso es exactamente lo que evita que dentro de seis meses alguien —tú, un colega o un agente— reabra una decisión que ya estaba cerrada.

## Antes de cerrar: el self-audit

Antes de escribir los artefactos finales, `/spec` audita sus propias propuestas con cinco chequeos: **redundancia, conflicto, migración, timing y datos existentes**. En la práctica atrapa la mayoría de los problemas *en diseño, no en código* — que es muchísimo más barato.

Y termina con una prueba de fuego simple pero exigente:

> ¿Podría una sesión nueva implementar el paso 1 sin hacer ni una sola pregunta?

Si la respuesta es no, al spec todavía le falta algo.

## El contrato con un agente sin memoria

Si tuviera que resumir por qué funciona, es esto: un spec es **un contrato con un agente que no tiene memoria**. Externalizas las decisiones para que cualquier sesión futura —una persona o un modelo— pueda ejecutar sin perder contexto. Los documentos sirven a humanos *y* a modelos por igual. Eso es *context engineering*, no burocracia.

## Pruébalo

- La charla completa, en vivo: **[Decisiones conscientes](/slides/decisiones-conscientes/)**
- El skill, open-source: **[github.com/CristianLlanos/spec-skill](https://github.com/CristianLlanos/spec-skill)**
- El ejemplo real que uso en la charla: **[anvil](https://github.com/CristianLlanos/anvil)**

El reto, para tu próxima feature: no abras el editor primero. Escribe la fricción en una frase, lista las opciones con sus tradeoffs, anota qué rechazaste y por qué — y recién entonces, codea.
