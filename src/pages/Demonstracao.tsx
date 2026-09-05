import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICOS_DEMO } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';
import { PhoneEmulator3D } from '../components/PhoneEmulator3D';
import { PhoneScreen } from '../components/PhoneScreen';

function RobotIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="Assistente" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="14" rx="3" fill="none" stroke="var(--azul)" strokeWidth="2"/>
      <path d="M8 18h8" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8.5" cy="9" r="1.5" fill="var(--azul)"/>
      <circle cx="15.5" cy="9" r="1.5" fill="var(--azul)"/>
      <rect x="10" y="13" width="4" height="1.5" rx="0.5" fill="var(--azul)"/>
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );
}

export function Demonstracao() {
  const { config } = useAcessibilidade();
  const [mensagem, setMensagem] = useState('Olá! Toque no app Chrome ou Gov.br para começar a demonstração.');
  const [auto, setAuto] = useState(false);
  const [servicoId, setServicoId] = useState('govbr');
  const [sessao, setSessao] = useState(0);

  function iniciarAuto() {
    setSessao((s) => s + 1);
    setMensagem('Assista: vou fazer tudo sozinha, do início ao fim. Toque no celular para assumir.');
    setAuto(true);
  }

  function pararAuto(msg = 'Você assumiu o controle. Continue de onde parou, sem pressa.') {
    setAuto(false);
    setMensagem(msg);
  }

  function anunciar(texto: string) {
    falar(texto, config.leituraEmVoz);
  }

  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Demonstração guiada
      </p>
      <h1>Demonstração interativa</h1>
      <p className="subtitulo">
        Use o celular 3D como se fosse real — ou aperte <strong>Ver sozinho</strong> e
        assista a IA fazer tudo, como se estivesse gerando a solução naquele momento.
      </p>
      <div className="acoes-linha" role="group" aria-label="Opções da demonstração">
        {!auto ? (
          <button type="button" className="botao botao-primario" onClick={iniciarAuto}>
            ▶ Ver sozinho (automático)
          </button>
        ) : (
          <button type="button" className="botao botao-aviso" onClick={() => pararAuto()}>
            ■ Parar e assumir
          </button>
        )}
        <label className="demo-servico">
          Serviço:
          <select value={servicoId} onChange={(e) => { setServicoId(e.target.value); setAuto(false); }} aria-label="Escolher serviço demonstrado">
            {SERVICOS_DEMO.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="demo-3d-area">
        <section className="painel-assistente" aria-live="polite" aria-label="Assistente">
          <p className="etiqueta"><RobotIcon /> Assistente diz:</p>
          <p className="fala-grande">"{mensagem}"</p>
          <div className="acoes-linha">
            <button type="button" className="botao botao-secundario" onClick={() => anunciar(mensagem)}>
              <VolumeIcon /> Ouvir de novo
            </button>
          </div>
        </section>

        <section className="painel-tela-3d" aria-label="Emulador 3D do celular">
          <PhoneEmulator3D mensagem={mensagem}>
            <PhoneScreen
              key={`${servicoId}-${sessao}`}
              servicoId={servicoId}
              auto={auto}
              onMensagem={setMensagem}
              onAutoFim={() => pararAuto('Pronto! Fiz tudo sozinha — agora tente você, sem pressa.')}
            />
          </PhoneEmulator3D>
        </section>
      </div>

      <section className="demo-info-lateral">
        <div className="demo-info-card">
          <h3>Como usar</h3>
          <ul>
            <li>Toque nos <strong>ícones</strong> do celular para navegar</li>
            <li>O <strong>assistente</strong> guia cada passo com voz</li>
            <li>Use <strong>"Simular erro"</strong> para ver como o assistente traduz</li>
            <li>Clique em <strong>"Ouvir de novo"</strong> para repetir a instrução</li>
          </ul>
        </div>
        <div className="demo-info-card">
          <h3>O que está sendo demonstrado</h3>
          <ul>
            <li>Tela inicial com apps (como um celular real)</li>
            <li>Abrindo o navegador → Gov.br</li>
            <li>Login passo a passo com assistente</li>
            <li>Tradução de erros técnicos em linguagem simples</li>
          </ul>
        </div>
      </section>
    </div>
  );
}