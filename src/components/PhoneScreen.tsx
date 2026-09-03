import { useState } from 'react';
import { PASSOS_GOVBR } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';

type Tela = 'home' | 'navegador' | 'govbr' | 'login' | 'concluido';

type Props = {
  onMensagem?: (texto: string) => void;
};

const APPS = [
  { id: 'govbr', nome: 'Gov.br', cor: '#1351b4', icone: '🇧🇷' },
  { id: 'chrome', nome: 'Chrome', cor: '#4285f4', icone: '🌐' },
  { id: 'whatsapp', nome: 'WhatsApp', cor: '#25d366', icone: '💬' },
  { id: 'camera', nome: 'Câmera', cor: '#333', icone: '📷' },
  { id: 'mapas', nome: 'Mapas', cor: '#4285f4', icone: '🗺️' },
  { id: 'relogio', nome: 'Relógio', cor: '#000', icone: '⏰' },
  { id: 'calc', nome: 'Calc', cor: '#5f6368', icone: '🧮' },
  { id: 'notas', nome: 'Notas', cor: '#fbbc04', icone: '📝' },
];

export function PhoneScreen({ onMensagem }: Props) {
  const { config } = useAcessibilidade();
  const [tela, setTela] = useState<Tela>('home');
  const [indice, setIndice] = useState(0);
  const [valor, setValor] = useState('');
  const [mostrarErro, setMostrarErro] = useState(false);
  const [digitando, setDigitando] = useState(false);

  const passo = PASSOS_GOVBR[indice];

  function anunciar(texto: string) {
    falar(texto, config.leituraEmVoz);
    onMensagem?.(texto);
  }

  function abrirNavegador() {
    setTela('navegador');
    anunciar('Abrindo o navegador. Agora vou te guiar para o site do Gov.br.');
    setTimeout(() => setTela('govbr'), 1500);
  }

  function abrirGovbr() {
    setTela('login');
    setIndice(0);
    anunciar(`Tela de login do Gov.br. ${PASSOS_GOVBR[0].titulo}. ${PASSOS_GOVBR[0].instrucaoAmigavel}`);
  }

  function avancar() {
    setMostrarErro(false);
    if (indice < PASSOS_GOVBR.length - 1) {
      setIndice(indice + 1);
      setValor('');
      const proximo = PASSOS_GOVBR[indice + 1];
      anunciar(`${proximo.titulo}. ${proximo.instrucaoAmigavel}`);
    } else {
      setTela('concluido');
      anunciar('Parabéns! Você entrou com sucesso no Gov.br!');
    }
  }

  function voltar() {
    if (indice === 0) return;
    setMostrarErro(false);
    setValor('');
    setIndice(indice - 1);
  }

  function simularErro() {
    setMostrarErro(true);
    if (passo.erroAmigavel) anunciar(passo.erroAmigavel);
  }

  if (tela === 'home') {
    return (
      <div className="ph-home">
        <div className="ph-wallpaper">
          <div className="ph-wallpaper-shape ph-ws-1" />
          <div className="ph-wallpaper-shape ph-ws-2" />
          <div className="ph-wallpaper-shape ph-ws-3" />
        </div>
        <div className="ph-home-clock">9:41</div>
        <div className="ph-home-data">Quarta-feira, 3 de setembro</div>
        <div className="ph-app-grid">
          {APPS.map((app) => (
            <button
              key={app.id}
              className="ph-app-icone"
              onClick={() => {
                if (app.id === 'chrome') abrirNavegador();
                else if (app.id === 'govbr') abrirGovbr();
                else anunciar(`App ${app.nome} — funcionalidade não disponível nesta demonstração.`);
              }}
            >
              <div className="ph-app-icone-img" style={{ background: app.cor }}>
                <span>{app.icone}</span>
              </div>
              <span className="ph-app-icone-nome">{app.nome}</span>
            </button>
          ))}
        </div>
        <div className="ph-home-dock">
          <button className="ph-app-icone" onClick={abrirNavegador}>
            <div className="ph-app-icone-img" style={{ background: '#4285f4' }}>
              <span>🌐</span>
            </div>
          </button>
          <button className="ph-app-icone" onClick={() => anunciar('Telefone — funcionalidade não disponível.')}>
            <div className="ph-app-icone-img" style={{ background: '#34a853' }}>
              <span>📞</span>
            </div>
          </button>
          <button className="ph-app-icone" onClick={() => anunciar('WhatsApp — funcionalidade não disponível.')}>
            <div className="ph-app-icone-img" style={{ background: '#25d366' }}>
              <span>💬</span>
            </div>
          </button>
          <button className="ph-app-icone" onClick={() => anunciar('Câmera — funcionalidade não disponível.')}>
            <div className="ph-app-icone-img" style={{ background: '#333' }}>
              <span>📷</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (tela === 'navegador') {
    return (
      <div className="ph-browser">
        <div className="ph-browser-bar">
          <div className="ph-browser-url">
            <span className="ph-browser-lock">🔒</span>
            <span>gov.br</span>
          </div>
        </div>
        <div className="ph-browser-loading">
          <div className="ph-browser-spinner" />
          <span>Carregando gov.br...</span>
        </div>
      </div>
    );
  }

  if (tela === 'govbr') {
    return (
      <div className="ph-govbr">
        <div className="ph-govbr-header">
          <div className="ph-govbr-logo">gov.br</div>
        </div>
        <div className="ph-govbr-conteudo">
          <div className="ph-govbr-banner">
            <div className="ph-govbr-banner-texto">
              <strong>Bem-vindo ao Gov.br</strong>
              <p>Acesse serviços do governo com segurança</p>
            </div>
          </div>
          <button className="ph-govbr-btn-entrar" onClick={abrirGovbr}>
            Entrar com Gov.br
          </button>
          <div className="ph-govbr-info">
            <p>🔹 Acesse mais de 4.000 serviços</p>
            <p>🔹 Segurança garantida</p>
            <p>🔹 Use CPF e senha</p>
          </div>
        </div>
      </div>
    );
  }

  if (tela === 'concluido') {
    return (
      <div className="ph-sucesso">
        <div className="ph-sucesso-icone">🎉</div>
        <h3>Conta aberta!</h3>
        <p>Você acessou o Gov.br com sucesso.</p>
        <button className="ph-btn ph-btn-primario" onClick={() => { setTela('home'); setIndice(0); setValor(''); }}>
          Voltar ao início
        </button>
      </div>
    );
  }

  // Tela de login (passos do Gov.br)
  const progresso = Math.round(((indice + 1) / PASSOS_GOVBR.length) * 100);

  return (
    <div className="ph-login">
      <div className="ph-login-header">
        <button className="ph-login-back" onClick={() => setTela('govbr')}>←</button>
        <span>Entrar com Gov.br</span>
      </div>

      <div className="ph-login-logo">
        <div className="ph-login-logo-icon">🇧🇷</div>
        <div className="ph-login-logo-text">gov.br</div>
      </div>

      <div className="ph-login-progresso">
        <div className="ph-login-progresso-fill" style={{ width: `${progresso}%` }} />
      </div>
      <div className="ph-login-passo-texto">
        Passo {indice + 1} de {PASSOS_GOVBR.length}
      </div>

      <div className="ph-login-dots">
        {PASSOS_GOVBR.map((p, i) => (
          <span
            key={p.id}
            className={`ph-login-dot ${i === indice ? 'atual' : i < indice ? 'feito' : ''}`}
          />
        ))}
      </div>

      {passo.campo ? (
        <div className="ph-login-campo">
          <label>{passo.campo.rotulo}</label>
          <input
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
              setDigitando(true);
            }}
            onFocus={() => setDigitando(true)}
            onBlur={() => setDigitando(false)}
            placeholder={passo.campo.exemplo}
            inputMode={passo.campo.tipo === 'texto' ? 'text' : 'numeric'}
            type={passo.campo.tipo === 'senha' ? 'password' : 'text'}
            autoComplete="off"
          />
          <small>🔒 Dados ficam só neste aparelho</small>
        </div>
      ) : (
        <div className="ph-login-info">
          {indice === PASSOS_GOVBR.length - 1
            ? '🎉 Conta aberta com sucesso!'
            : 'Toque em "Continuar" para avançar.'}
        </div>
      )}

      {mostrarErro && passo.erroTecnico && (
        <div className="ph-login-erro">
          <div className="ph-login-erro-portal">
            <span className="ph-login-erro-icon">❌</span>
            <span>{passo.erroTecnico}</span>
          </div>
          <div className="ph-login-erro-assistente">
            <span className="ph-login-erro-icon">🤖</span>
            <span>{passo.erroAmigavel}</span>
          </div>
        </div>
      )}

      <div className="ph-login-botoes">
        <button className="ph-btn ph-btn-secundario" onClick={voltar} disabled={indice === 0}>
          ← Voltar
        </button>
        <button className="ph-btn ph-btn-primario" onClick={avancar}>
          {indice === PASSOS_GOVBR.length - 1 ? 'Concluir 🎉' : 'Continuar →'}
        </button>
      </div>

      {passo.erroAmigavel && !mostrarErro && (
        <button className="ph-btn ph-btn-erro" onClick={simularErro}>
          ⚠️ Simular erro do portal
        </button>
      )}
    </div>
  );
}
