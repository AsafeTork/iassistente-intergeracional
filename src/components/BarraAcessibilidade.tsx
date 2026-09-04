import { useAcessibilidade } from '../hooks/useAcessibilidade';

const ITENS = [
  { chave: 'fonteGrande', rotulo: '🔍 Letra grande', descricao: 'Aumenta o texto' },
  { chave: 'altoContraste', rotulo: '◐ Alto contraste', descricao: 'Fundo escuro, texto claro' },
  { chave: 'modoSimples', rotulo: '✨ Modo simples', descricao: 'Esconde extras' },
  { chave: 'leituraEmVoz', rotulo: '🔊 Ler em voz alta', descricao: 'Dita as instruções' },
] as const;

export function BarraAcessibilidade() {
  const { config, alternar } = useAcessibilidade();

  return (
    <section className="barra-acess" aria-label="Opções rápidas de acessibilidade" aria-live="polite">
      {ITENS.map((item) => {
        const ativo = config[item.chave];
        return (
          <button
            key={item.chave}
            type="button"
            className={ativo ? 'chip chip-ativo' : 'chip'}
            aria-pressed={ativo}
            title={item.descricao}
            onClick={() => alternar(item.chave)}
          >
            {item.rotulo}
          </button>
        );
      })}
    </section>
  );
}
