import type { Tela } from './PhoneScreen';

type Props = {
  telaAtual: Tela;
  onTelaChange: (tela: Tela) => void;
  totalTelas?: number;
};

const TELAS: Tela[] = ['home', 'navegador', 'govbr', 'login', 'concluido'];

export function PhonePagination({ telaAtual, onTelaChange }: Props) {
  const indiceAtual = TELAS.indexOf(telaAtual);
  const podeVoltar = indiceAtual > 0;
  const podeAvancar = indiceAtual < TELAS.length - 1;

  return (
    <div className="ph-pagination">
      <button
        className="ph-pagination-seta"
        disabled={!podeVoltar}
        onClick={() => podeVoltar && onTelaChange(TELAS[indiceAtual - 1])}
        aria-label="Tela anterior"
        type="button"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="ph-pagination-dots">
        {TELAS.map((t, i) => (
          <button
            key={t}
            className={`ph-pagination-dot ${i === indiceAtual ? 'ativo' : ''}`}
            onClick={() => onTelaChange(t)}
            aria-label={`Ir para tela ${t}`}
            type="button"
          />
        ))}
      </div>

      <button
        className="ph-pagination-seta"
        disabled={!podeAvancar}
        onClick={() => podeAvancar && onTelaChange(TELAS[indiceAtual + 1])}
        aria-label="Próxima tela"
        type="button"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
