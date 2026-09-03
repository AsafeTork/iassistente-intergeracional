import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PASSOS_GOVBR } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';
import { PhoneEmulator3D } from '../components/PhoneEmulator3D';
import { PhoneScreen } from '../components/PhoneScreen';

export function Demonstracao() {
  const { config } = useAcessibilidade();
  const [mensagem, setMensagem] = useState('Olá! Toque no app Chrome ou Gov.br para começar a demonstração.');
  const [etapaAtual, setEtapaAtual] = useState(0);

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
        Use o celular 3D como se fosse real — abra o navegador, acesse o Gov.br e siga o passo a passo.
      </p>

      <div className="demo-3d-area">
        <section className="painel-assistente" aria-live="polite" aria-label="Assistente">
          <p className="etiqueta">🤖 Assistente diz:</p>
          <p className="fala-grande">"{mensagem}"</p>
          <div className="acoes-linha">
            <button type="button" className="botao botao-secundario" onClick={() => anunciar(mensagem)}>
              🔊 Ouvir de novo
            </button>
          </div>
        </section>

        <section className="painel-tela-3d" aria-label="Emulador 3D do celular">
          <PhoneEmulator3D>
            <PhoneScreen onMensagem={setMensagem} />
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
