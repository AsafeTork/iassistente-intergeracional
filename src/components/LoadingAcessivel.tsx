type Props = {
  mensagem?: string;
  percentual?: number;
};

export function LoadingAcessivel({
  mensagem = 'Um momento, estamos preparando tudo...',
  percentual,
}: Props) {
  const determinado =
    typeof percentual === 'number' && Number.isFinite(percentual);
  const valor = determinado
    ? Math.min(100, Math.max(0, Math.round(percentual as number)))
    : undefined;

  return (
    <div className="loading-idoso" role="status" aria-live="polite">
      <p className="loading-mensagem">
        {mensagem}
        {valor === undefined && (
          <span className="loading-pontos" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        )}
      </p>
      {valor !== undefined ? (
        <div
          className="loading-barra"
          role="progressbar"
          aria-valuenow={valor}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={mensagem}
        >
          <div
            className="loading-barra-fill"
            style={{ width: `${valor}%` }}
          />
        </div>
      ) : (
        <p className="loading-indeterminado" aria-hidden="true">
          Carregando
          <span className="loading-pontos">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      )}
    </div>
  );
}

export default LoadingAcessivel;
