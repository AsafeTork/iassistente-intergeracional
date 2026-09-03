import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TUTORES } from '../data/mock';

export function Tutoria() {
  const [pedido, setPedido] = useState<string | null>(() => {
    try {
      return localStorage.getItem('iassistente:tutor:v1');
    } catch {
      return null;
    }
  });
  const [nome, setNome] = useState('');

  function pedir(tutorId: string) {
    setPedido(tutorId);
    try {
      localStorage.setItem('iassistente:tutor:v1', tutorId);
    } catch {
      /* sem persistência */
    }
  }

  const tutorEscolhido = TUTORES.find((t) => t.id === pedido);

  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Tutoria reversa
      </p>
      <h1>Jovens que ensinam com paciência</h1>
      <p className="subtitulo">
        Na <strong>tutoria reversa</strong>, o jovem é o professor de tecnologia — e aprende escuta,
        empatia e cidadania. O tutor <strong>nunca vê sua senha</strong>: ele só vê em qual passo você
        está.
      </p>

      {tutorEscolhido && (
        <section className="selo-sucesso" aria-live="polite">
          <h2>✅ Pedido registrado para {tutorEscolhido.nome}!</h2>
          <p>
            {nome ? `Obrigado, ${nome}! ` : ''}No app real, {tutorEscolhido.nome} receberia um aviso e
            marcaria uma videochamada guiada. Aqui o pedido ficou salvo neste navegador (demonstração).
          </p>
        </section>
      )}

      <div className="grade">
        {TUTORES.map((t) => (
          <article key={t.id} className="cartao">
            <h3>
              {t.nome}, {t.idade} anos
            </h3>
            <p>
              {t.escola} • <strong>{t.especialidade}</strong>
            </p>
            <p>⭐ {t.avaliacao.toFixed(1)} — avaliado por idosos atendidos</p>
            <button
              type="button"
              className={pedido === t.id ? 'botao botao-secundario' : 'botao botao-primario'}
              onClick={() => pedir(t.id)}
            >
              {pedido === t.id ? 'Pedido feito ✓' : `Pedir ajuda de ${t.nome.split(' ')[0]}`}
            </button>
          </article>
        ))}
      </div>

      <section className="secao" aria-labelledby="tit-nome">
        <h2 id="tit-nome">Como quer ser chamado?</h2>
        <label className="rotulo" htmlFor="nome-idoso">
          Seu primeiro nome (opcional, fica só neste aparelho)
        </label>
        <input
          id="nome-idoso"
          className="entrada"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Dona Maria"
          autoComplete="given-name"
        />
        <p className="detalhe">O assistente usa seu nome nas instruções faladas: “Muito bem, Dona Maria!”.</p>
      </section>
    </div>
  );
}
