import { useState, useEffect } from 'react';
import { useAcessibilidade } from '../hooks/useAcessibilidade';

declare global {
  interface Window { vLibras?: { init: () => void; destroy: () => void; }; }
}

const ITENS = [
  { chave: 'fonteGrande', rotulo: '🔍 Letra grande', descricao: 'Aumenta o texto' },
  { chave: 'altoContraste', rotulo: '◐ Alto contraste', descricao: 'Fundo escuro, texto claro' },
  { chave: 'modoSimples', rotulo: '✨ Modo simples', descricao: 'Esconde extras' },
  { chave: 'leituraEmVoz', rotulo: '🔊 Ler em voz alta', descricao: 'Dita as instruções' },
  { chave: 'libras', rotulo: '📜 Libras', descricao: 'Traduz texto para Língua Brasileira' },
  { chave: 'reduceMotion', rotulo: '🔇 Reduzir animações', descricao: 'Desativa animações e transições' },
  { chave: 'darkMode', rotulo: '🌙 Modo escuro', descricao: 'Ativa tema escuro' },
] as const;

export function BarraAcessibilidade() {
  const { config, alternar } = useAcessibilidade();
  const [librasInicializado, setLibrasInicializado] = useState(false);

  useEffect(() => {
    if (config.libras && !librasInicializado) {
      try {
        if (window.vLibras) {
          window.vLibras.init();
          setLibrasInicializado(true);
        }
      } catch {
        alternar('libras');
      }
    } else if (!config.libras && librasInicializado) {
      try {
        if (window.vLibras) {
          window.vLibras.destroy();
        }
      } catch {
        /* erro ao destruir: ignora */
      }
      setLibrasInicializado(false);
    }
  }, [config.libras, librasInicializado, alternar]);

  return (
    <section className="bg-light border rounded-3 p-3 mb-4" aria-label="Opções rápidas de acessibilidade" aria-live="polite">
      <div className="btn-group flex-wrap gap-2" role="group">
        {ITENS.map((item) => {
          const ativo = config[item.chave];
          return (
            <button
              key={item.chave}
              type="button"
              className={`btn ${ativo ? 'btn-primary' : 'btn-outline-primary'} ${ativo ? 'active' : ''}`}
              aria-pressed={ativo}
              title={item.descricao}
              onClick={() => alternar(item.chave)}
            >
              {item.rotulo}
            </button>
          );
        })}
      </div>
    </section>
  );
}