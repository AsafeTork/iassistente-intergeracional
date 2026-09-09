import { useEffect, useState } from 'react';
import { SeloDemoGov } from './SeloDemoGov';

const FALAS = [
  'Oi! Sou a Lia, sua assistente. Vou te guiar com calma.',
  'Toque no botão amarelo "Entrar com Gov.br". Sem pressa, eu estou aqui.',
  'Digite seu CPF no espaço com a borda amarela. Vamos juntas!',
  'Pronto! Você conseguiu sozinha. Estou tão orgulhosa!',
];

/** Mockup do celular com a IA "falando" (só texto, encenação da home). */
export function MockupFalante() {
  const [falaIdx, setFalaIdx] = useState(0);
  const [nChars, setNChars] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setNChars(FALAS[falaIdx].length);
      return;
    }
    const fala = FALAS[falaIdx];
    if (nChars < fala.length) {
      const t = window.setTimeout(() => setNChars((n) => n + 2), 45);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setFalaIdx((i) => (i + 1) % FALAS.length);
      setNChars(0);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [nChars, falaIdx]);

  return (
    <div className="celular" role="img" aria-label="Exemplo da interface assistiva falando. Demonstração acadêmica, não é Gov.br oficial.">
      <div className="celular-notch" aria-hidden="true" />
      <SeloDemoGov />
      <p className="celular-topo">ENTRAR COM GOV.BR</p>
      <div className="celular-campo-destaque">
        <label htmlFor="demo-cpf-home">Digite seu CPF aqui</label>
        <input id="demo-cpf-home" placeholder="123.456.789-00" inputMode="numeric" readOnly value="" />
      </div>
      <p className="celular-fala" aria-live="polite">
        <span aria-hidden="true">🤖 </span>“{FALAS[falaIdx].slice(0, nChars)}
        {nChars < FALAS[falaIdx].length ? '▍' : ''}”
      </p>
      <span className="celular-botao" aria-hidden="true">Enviar</span>
    </div>
  );
}
