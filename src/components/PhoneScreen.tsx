import { useState } from 'react';
import { PASSOS_GOVBR } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';

const CHAVE_PROGRESSO = 'iassistente:progresso:v1';

function lerProgresso(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) ?? '[]');
  } catch {
    return [];
  }
}

type Props = {
  onAvancar?: () => void;
  onVoltar?: () => void;
  onErro?: () => void;
  indice: number;
  setIndice: (i: number) => void;
  concluidos: string[];
  setConcluidos: (c: string[]) => void;
};

export function PhoneScreen({
  onAvancar,
  onVoltar,
  onErro,
  indice,
  setIndice,
  concluidos,
  setConcluidos,
}: Props) {
  const { config } = useAcessibilidade();
  const [valor, setValor] = useState('');
  const [mostrarErro, setMostrarErro] = useState(false);

  const passo = PASSOS_GOVBR[indice];
  const ultimo = indice === PASSOS_GOVBR.length - 1;
  const progresso = Math.round(((indice + 1) / PASSOS_GOVBR.length) * 100);

  function avancar() {
    setMostrarErro(false);
    const novos = Array.from(new Set([...concluidos, passo.id]));
    setConcluidos(novos);
    try {
      localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(novos));
    } catch { /* */ }
    if (!ultimo) {
      setIndice(indice + 1);
      setValor('');
      falar(`${PASSOS_GOVBR[indice + 1].titulo}. ${PASSOS_GOVBR[indice + 1].instrucaoAmigavel}`, config.leituraEmVoz);
    } else {
      falar('Demonstração concluída. Parabéns!', config.leituraEmVoz);
    }
    onAvancar?.();
  }

  function voltar() {
    if (indice === 0) return;
    setMostrarErro(false);
    setValor('');
    setIndice(indice - 1);
    onVoltar?.();
  }

  function simularErro() {
    setMostrarErro(true);
    if (passo.erroAmigavel) falar(passo.erroAmigavel, config.leituraEmVoz);
    onErro?.();
  }

  return (
    <>
      <div className="phone-ui-header">
        ENTRAR COM GOV.BR
      </div>

      <div className="phone-ui-logo">
        <div className="phone-ui-logo-gov">gov.br</div>
        <div className="phone-ui-logo-sub">Acesse serviços do governo</div>
      </div>

      <div className="phone-ui-progresso">
        <div className="phone-ui-progresso-fill" style={{ width: `${progresso}%` }} />
      </div>

      <div className="phone-ui-nav">
        {PASSOS_GOVBR.map((p, i) => (
          <button
            key={p.id}
            className={`phone-ui-nav-dot ${i === indice ? 'ativo' : i < indice ? 'feito' : ''}`}
            onClick={() => { setIndice(i); setValor(''); setMostrarErro(false); }}
            aria-label={p.titulo}
          />
        ))}
      </div>

      {passo.campo ? (
        <div className="phone-ui-campo">
          <label>{passo.campo.rotulo}</label>
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder={passo.campo.exemplo}
            inputMode={passo.campo.tipo === 'texto' ? 'text' : 'numeric'}
            type={passo.campo.tipo === 'senha' ? 'password' : 'text'}
            autoComplete="off"
          />
          <small>Dados ficam só neste aparelho</small>
        </div>
      ) : (
        <div className="phone-ui-info">
          {ultimo ? '🎉 Conta aberta com sucesso!' : 'Toque em continuar para o próximo passo.'}
        </div>
      )}

      {mostrarErro && passo.erroTecnico && (
        <div className="phone-ui-erro">
          <div><strong>Portal:</strong> {passo.erroTecnico}</div>
          <div className="phone-ui-erro-traducao">
            <strong>Assistente:</strong> {passo.erroAmigavel}
          </div>
        </div>
      )}

      <div className="phone-ui-botoes">
        <button
          className="phone-ui-btn phone-ui-btn-secundario"
          onClick={voltar}
          disabled={indice === 0}
        >
          ← Voltar
        </button>
        <button
          className="phone-ui-btn phone-ui-btn-primario"
          onClick={avancar}
        >
          {ultimo ? 'Concluir 🎉' : 'Continuar →'}
        </button>
      </div>

      {passo.erroAmigavel && !mostrarErro && (
        <button
          className="phone-ui-btn phone-ui-btn-secundario"
          onClick={simularErro}
          style={{ fontSize: '0.7rem', padding: '0.4rem' }}
        >
          ⚠️ Simular erro
        </button>
      )}

      <div className="phone-ui-privacidade">
        🔒 Privacidade: senhas e CPF ficam só aqui
      </div>
    </>
  );
}
