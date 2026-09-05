type Props = {
  remetente: string;
  codigo: string;
  aberta: boolean;
  onAbrir: () => void;
  onUsarCodigo: () => void;
  onFechar: () => void;
};

/**
 * Sombra de notificações estilo Android dentro do celular da demo.
 * O robô guia a pessoa: ver o pip → abrir → tocar no código → digitar.
 */
export function NotificacaoAndroid({ remetente, codigo, aberta, onAbrir, onUsarCodigo, onFechar }: Props) {
  if (!aberta) {
    return (
      <button
        type="button"
        className="ph-notif-pip"
        onClick={onAbrir}
        aria-label={`Nova notificação de ${remetente}. Toque para abrir.`}
      >
        <span className="ph-notif-pip-app">SMS</span>
        <span className="ph-notif-pip-texto">
          {remetente}: seu código é {codigo}
        </span>
      </button>
    );
  }
  return (
    <div className="ph-notif-shade" role="dialog" aria-label="Notificações">
      <div className="ph-notif-shade-topo">
        <span>Notificações</span>
        <button type="button" className="ph-notif-fechar" onClick={onFechar} aria-label="Fechar notificações">
          ✕
        </button>
      </div>
      <div className="ph-notif-card">
        <div className="ph-notif-card-app">
          <span className="ph-notif-card-icone">💬</span>
          <span>
            {remetente} • agora
          </span>
        </div>
        <p className="ph-notif-card-texto">
          Seu código de acesso é <strong>{codigo}</strong>. Não compartilhe com ninguém.
        </p>
        <button type="button" className="ph-notif-usar" onClick={onUsarCodigo}>
          Usar este código
        </button>
      </div>
    </div>
  );
}
