import { useEffect, useState } from 'react';

function consultaMidia(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function temClasseBody(): boolean {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('reduce-motion');
}

export function useReducedMotion(): boolean {
  const [reduzido, setReduzido] = useState<boolean>(() => consultaMidia() || temClasseBody());

  useEffect(() => {
    const atualizar = () => setReduzido(consultaMidia() || temClasseBody());

    atualizar();

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aoMudarMidia = () => atualizar();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', aoMudarMidia);
    } else {
      mq.addListener(aoMudarMidia);
    }

    const observador = new MutationObserver(atualizar);
    observador.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', aoMudarMidia);
      } else {
        mq.removeListener(aoMudarMidia);
      }
      observador.disconnect();
    };
  }, []);

  return reduzido;
}
