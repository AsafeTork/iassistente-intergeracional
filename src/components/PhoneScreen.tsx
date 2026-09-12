import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CAMINHOS_NIVEL, NIVEIS_CONTA, SERVICOS_DEMO, type NivelConta, type ServicoDemo } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';
import { codigoValido, cpfValido, mascararCPF, senhaValida, soDigitos } from '../lib/documentos';
import { traduzirErro } from '../lib/tradutorErros';
import { AIScanHighlight } from './AIScanHighlight';
import { GovbrNativo } from './GovbrNativo';
import { LoadingAcessivel } from './LoadingAcessivel';
import { NotificacaoAndroid } from './NotificacaoAndroid';
import { SeloDemoGov } from './SeloDemoGov';
import { Skeleton } from './Skeleton';

type Tela = 'home' | 'navegador' | 'govbr' | 'login' | 'concluido';

export type { Tela };

type Props = {
  onMensagem?: (texto: string) => void;
  /** Serviço demonstrado (genérico: Gov.br, SUS...). Padrão: Gov.br. */
  servicoId?: string;
  /** Modo automático: abre o app e avança as etapas sozinho. */
  auto?: boolean;
  /** Chamado ao fim (ou ao cancelar com toque) do modo automático. */
  onAutoFim?: () => void;
  /** Avisa a tela atual (para a paginação externa). */
  onTelaMuda?: (tela: Tela) => void;
  /** Salto de tela vindo da paginação externa. */
  salto?: { tela: Tela; n: number };
  /** Nível conquistado exibido no selo da tela de conclusão. Padrão: bronze. */
  nivelInicial?: NivelConta;
};

function Bullet() {
  return (
    <svg viewBox="0 0 8 8" width="0.6em" height="0.6em" aria-hidden="true" fill="var(--azul)" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" rx="1"/>
    </svg>
  );
}

function GovLogo({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 120 40" width={small ? 64 : 88} height={small ? 22 : 30} role="img" aria-label="gov.br">
      <text x="0" y="28" fontFamily="'Rawline', system-ui" fontWeight="800" fontSize="28" fill="var(--azul)">gov</text>
      <text x="52" y="28" fontFamily="'Rawline', system-ui" fontWeight="400" fontSize="28" fill="var(--azul)">.br</text>
    </svg>
  );
}

function GovLogoWhite({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 120 40" width={small ? 64 : 88} height={small ? 22 : 30} role="img" aria-label="gov.br">
      <text x="0" y="28" fontFamily="'Rawline', system-ui" fontWeight="800" fontSize="28" fill="#fff">gov</text>
      <text x="52" y="28" fontFamily="'Rawline', system-ui" fontWeight="400" fontSize="28" fill="#fff">.br</text>
    </svg>
  );
}

function Hamburger({ color = '#fff' }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="2" rx="1" fill={color} />
      <rect x="0" y="7" width="24" height="2" rx="1" fill={color} />
      <rect x="0" y="14" width="24" height="2" rx="1" fill={color} />
    </svg>
  );
}

function Globe() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 0 20"/>
    </svg>
  );
}

function Chat() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="var(--azul)" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function Camera() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function Mapa() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );
}

function Relogio() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function Calc() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <circle cx="8" cy="11" r="1.5" fill="var(--azul)"/>
      <circle cx="12" cy="11" r="1.5" fill="var(--azul)"/>
      <circle cx="16" cy="11" r="1.5" fill="var(--azul)"/>
      <line x1="8" y1="15" x2="16" y2="15"/>
      <circle cx="8" cy="19" r="1.5" fill="var(--azul)"/>
      <circle cx="12" cy="19" r="1.5" fill="var(--azul)"/>
      <circle cx="16" cy="19" r="1.5" fill="var(--azul)"/>
    </svg>
  );
}

function Notas() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--amarelo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function Cadeado() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function Estrela() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="var(--amarelo)" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function SetaEsq() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function SetaDir() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function Telefone() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function X() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="Erro" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="var(--vermelho)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="var(--vermelho)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function Robot() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="Assistente de IA" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="14" rx="3" fill="none" stroke="var(--azul)" strokeWidth="2"/>
      <path d="M8 18h8" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8.5" cy="9" r="1.5" fill="var(--azul)"/>
      <circle cx="15.5" cy="9" r="1.5" fill="var(--azul)"/>
      <rect x="10" y="13" width="4" height="1.5" rx="0.5" fill="var(--azul)"/>
    </svg>
  );
}

function Alerta() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="Atenção" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="var(--amarelo)" stroke="var(--azul)" strokeWidth="1"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.5" fill="var(--azul)"/>
    </svg>
  );
}

function SobeNivel() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v12"/>
      <polyline points="5 10 12 3 19 10"/>
      <path d="M5 21h14"/>
    </svg>
  );
}

function Volume() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function Pessoas() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

const APPS: { id: string; nome: string; cor: string; icone: ReactNode }[] = [
  { id: 'govbr', nome: 'Gov.br', cor: 'var(--azul)', icone: <GovLogoWhite small /> },
  { id: 'chrome', nome: 'Chrome', cor: '#4285f4', icone: <Globe /> },
  { id: 'whatsapp', nome: 'WhatsApp', cor: '#25d366', icone: <Chat /> },
  { id: 'camera', nome: 'Câmera', cor: '#333', icone: <Camera /> },
  { id: 'mapas', nome: 'Mapas', cor: '#4285f4', icone: <Mapa /> },
  { id: 'relogio', nome: 'Relógio', cor: '#000', icone: <Relogio /> },
  { id: 'calc', nome: 'Calc', cor: '#5f6368', icone: <Calc /> },
  { id: 'notas', nome: 'Notas', cor: '#fbbc04', icone: <Notas /> },
];

export function PhoneScreen({ onMensagem, servicoId = 'govbr', auto = false, onAutoFim, onTelaMuda, salto, nivelInicial = 'bronze' }: Props) {
  const { config } = useAcessibilidade();
  const servico: ServicoDemo = SERVICOS_DEMO.find((s) => s.id === servicoId) ?? SERVICOS_DEMO[0];
  const passos = servico.passos;
  const [nivel, setNivel] = useState<NivelConta>(nivelInicial);
  const [tela, setTelaEstado] = useState<Tela>('home');
  const [indice, setIndice] = useState(0);
  const [valor, setValor] = useState('');
  const [mostrarErro, setMostrarErro] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [codigoExpirado, setCodigoExpirado] = useState(false);
  const [scanIndex, setScanIndex] = useState(-1);
  const [notif, setNotif] = useState<'oculta' | 'pip' | 'aberta'>('oculta');
  const [nivelAberto, setNivelAberto] = useState(false);
  const navTimer = useRef<number | null>(null);
  const erroResumoRef = useRef<HTMLDivElement>(null);
  const autoTimers = useRef<number[]>([]);
  const autoRef = useRef(auto);
  autoRef.current = auto;
  const fimRef = useRef(onAutoFim);
  fimRef.current = onAutoFim;
  const telaMudaRef = useRef(onTelaMuda);
  telaMudaRef.current = onTelaMuda;

  // Navegação com aviso externo (paginação do mockup).
  function setTela(t: Tela) {
    setTelaEstado(t);
    setEnviando(false);
    setCodigoExpirado(false);
    telaMudaRef.current?.(t);
  }

  // Salto vindo da paginação externa.
  const saltoN = salto?.n ?? 0;
  useEffect(() => {
    if (saltoN === 0) return;
    setMostrarErro(false);
    setEnviando(false);
    setCodigoExpirado(false);
    setNotif('oculta');
    if (salto?.tela === 'login') {
      setIndice(0);
      setValor('');
    }
    if (salto) setTela(salto.tela);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltoN]);

  const passo = passos[indice];

  // Padrão GOV.UK: a MESMA redação traduzida aparece no resumo e junto ao campo.
  const textoTraduzidoErro = passo.erroTecnico ? traduzirErro(passo.erroTecnico, passo.id) : '';

  function focarCampo(passoId: string) {
    document.getElementById(`campo-${passoId}`)?.focus();
  }

  // GOV.UK: ao mostrar erro, mover o foco para o resumo (tabIndex -1 + .focus()).
  useEffect(() => {
    if (mostrarErro) erroResumoRef.current?.focus();
  }, [mostrarErro, indice]);

  function anunciar(texto: string) {
    falar(texto, config.leituraEmVoz);
    onMensagem?.(texto);
  }

  function limparAuto() {
    autoTimers.current.forEach((t) => window.clearTimeout(t));
    autoTimers.current = [];
  }

  // Modo automático: abre o app e conduz até o fim sozinho (qualquer toque cancela).
  useEffect(() => {
    if (!auto) {
      limparAuto();
      return;
    }
    const agenda = (fn: () => void, ms: number) => {
      autoTimers.current.push(window.setTimeout(() => {
        if (autoRef.current) fn();
      }, ms));
    };
    const avancarPara = (i: number) => {
      setMostrarErro(false);
      setNotif('oculta');
      if (i < passos.length - 1) {
        setIndice(i + 1);
        setValor('');
        const proximo = passos[i + 1];
        anunciar(`${proximo.titulo}. ${proximo.instrucaoAmigavel}`);
      } else {
        setTela('concluido');
        anunciar(`Parabéns! Você concluiu ${servico.nome} com sucesso!`);
      }
    };
    agenda(() => abrirNavegador(), 1200);
    agenda(() => abrirGovbr(), 3600);
    let t = 5600;
    passos.forEach((p, i) => {
      if (i === 0 && p.erroAmigavel) {
        // Erro real simulado na UI exata, com tradução acolhedora em seguida.
        agenda(() => {
          setValor(p.campo?.exemplo ?? '');
          setMostrarErro(true);
          anunciar(p.erroAmigavel ?? '');
        }, t);
        agenda(() => avancarPara(i), t + 3200);
        t += 3400;
      }
      if (p.campo?.tipo === 'codigo') {
        agenda(() => {
          setValor('');
          setNotif('pip');
          anunciar(`Chegou uma mensagem com o código. Arraste de cima para baixo para abrir as notificações.`);
        }, t);
        agenda(() => {
          setNotif('aberta');
          anunciar(`Aqui está o código, gerado agora para você. Toque em Usar este código.`);
        }, t + 2600);
        agenda(() => {
          setValor(servico.codigoSMS);
          setNotif('oculta');
          anunciar(`Código preenchido: ${servico.codigoSMS}. Agora toque em Enviar.`);
        }, t + 4600);
        agenda(() => avancarPara(i), t + 6600);
        t += 6800;
      } else if (!(i === 0 && p.erroAmigavel)) {
        agenda(() => setValor(p.campo?.exemplo ?? ''), t);
        agenda(() => avancarPara(i), t + 2200);
        t += 2400;
      } else {
        t += 0;
      }
    });
    agenda(() => fimRef.current?.(), t + 2500);
    return () => limparAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, servicoId]);

  // No modo manual, o SMS chega sozinho quando o passo do código aparece.
  useEffect(() => {
    if (auto || notif !== 'oculta' || passo?.campo?.tipo !== 'codigo') return;
    const t = window.setTimeout(() => {
      setNotif('pip');
      anunciar(`Chegou uma mensagem com o código. Toque na notificação lá em cima para abrir.`);
    }, 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, tela]);

  // Destaca só as ações válidas da home (Gov.br e Chrome), em loop suave.
  const ALVOS_SCAN = [0, 1];
  useEffect(() => {
    if (tela !== 'home') {
      setScanIndex(-1);
      return;
    }
    setScanIndex(-1);
    const timers: number[] = [];
    ALVOS_SCAN.forEach((appIdx, k) => {
      timers.push(window.setTimeout(() => setScanIndex(appIdx), 600 + k * 1200));
    });
    const loop = window.setInterval(() => {
      setScanIndex((atual) => {
        const pos = ALVOS_SCAN.indexOf(atual);
        return ALVOS_SCAN[(pos + 1) % ALVOS_SCAN.length];
      });
    }, 2400);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
      setScanIndex(-1);
    };
  }, [tela]);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, []);

  function abrirNavegador() {
    if (navTimer.current) clearTimeout(navTimer.current);
    setScanIndex(-1);
    setTela('navegador');
    anunciar('Abrindo o navegador. Agora vou te guiar para o site do Gov.br.');
    navTimer.current = window.setTimeout(() => setTela('govbr'), 1500);
  }

  function cancelarNavegador() {
    if (navTimer.current) clearTimeout(navTimer.current);
    setTela('home');
    anunciar('Voltei para a tela inicial. Toque no app Chrome ou Gov.br para começar.');
  }

  function abrirGovbr() {
    setScanIndex(-1);
    setTela('login');
    setIndice(0);
    setValor('');
    setMostrarErro(false);
    setEnviando(false);
    setCodigoExpirado(false);
    anunciar(`Tela de login: ${servico.nome}. ${passos[0].titulo}. ${passos[0].instrucaoAmigavel}`);
  }

  /** Máscara visual por tipo de campo (dados nunca saem do aparelho). */
  function tratarValor(tipo: string | undefined, texto: string): string {
    if (tipo === 'cpf') return mascararCPF(texto);
    if (tipo === 'codigo') return soDigitos(texto).slice(0, 6);
    return texto;
  }

  /** Validação local do passo atual; erro vira frase acolhedora, sem pressa. */
  function valorValido(tipo: string | undefined, texto: string): boolean {
    if (tipo === 'cpf') return cpfValido(texto);
    if (tipo === 'senha') return senhaValida(texto);
    if (tipo === 'codigo') return codigoValido(texto);
    return texto.trim().length > 0;
  }

  function passoValido(): boolean {
    if (!passo?.campo) return true;
    return valorValido(passo.campo.tipo, valor);
  }

  /** Enviar com guard anti-duplo-toque: valida, mostra erro acolhedor ou avança. */
  function enviar() {
    if (enviando) return;
    if (!passoValido()) {
      setMostrarErro(true);
      if (passo?.campo?.tipo === 'codigo') setCodigoExpirado(true);
      anunciar(passo?.erroAmigavel ?? 'Vamos conferir juntos, sem pressa.');
      return;
    }
    setEnviando(true);
    window.setTimeout(() => {
      setEnviando(false);
      avancar();
    }, 450);
  }

  /** Código venceu: gera outro ciclo de SMS e espera, sem pressa. */
  function reenviarCodigo() {
    setValor('');
    setMostrarErro(false);
    setCodigoExpirado(false);
    setNotif('pip');
    anunciar('Mandei outro código para você. Vou esperar aqui, sem pressa.');
  }

  function avancar() {
    setMostrarErro(false);
    setCodigoExpirado(false);
    if (indice < passos.length - 1) {
      const novo = indice + 1;
      setIndice(novo);
      setValor('');
      const proximo = passos[novo];
      anunciar(`${proximo.titulo}. ${proximo.instrucaoAmigavel}`);
    } else {
      setTela('concluido');
      anunciar(`Parabéns! Você concluiu ${servico.nome} com sucesso!`);
    }
  }

  function voltar() {
    if (indice === 0 || enviando) return;
    setMostrarErro(false);
    setCodigoExpirado(false);
    setValor('');
    setIndice(indice - 1);
  }

  function simularErro() {
    setMostrarErro(true);
    if (passo?.campo?.tipo === 'codigo') setCodigoExpirado(true);
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
          {APPS.map((app, i) => (
            <button
              key={app.id}
              className="ph-app-icone"
              onClick={() => {
                if (app.id === 'chrome') abrirNavegador();
                else if (app.id === 'govbr') abrirGovbr();
                else anunciar(`App ${app.nome} — funcionalidade não disponível nesta demonstração.`);
              }}
            >
              {scanIndex === i ? (
                <AIScanHighlight delay={0} label="toque aqui">
                  <div className="ph-app-icone-img" style={{ background: app.cor }}>
                    {app.icone}
                  </div>
                </AIScanHighlight>
              ) : (
                <div className="ph-app-icone-img" style={{ background: app.cor }}>
                  {app.icone}
                </div>
              )}
              <span className="ph-app-icone-nome">{app.nome}</span>
            </button>
          ))}
        </div>
        <div className="ph-home-dock">
          <button className="ph-app-icone" onClick={abrirNavegador}>
            <div className="ph-app-icone-img" style={{ background: '#4285f4' }}>
              <Globe />
            </div>
          </button>
          <button className="ph-app-icone" onClick={() => anunciar('Telefone — funcionalidade não disponível.')}>
            <div className="ph-app-icone-img" style={{ background: '#34a853' }}>
              <Telefone />
            </div>
          </button>
          <button className="ph-app-icone" onClick={() => anunciar('WhatsApp — funcionalidade não disponível.')}>
            <div className="ph-app-icone-img" style={{ background: '#25d366' }}>
              <Chat />
            </div>
          </button>
          <button className="ph-app-icone" onClick={() => anunciar('Câmera — funcionalidade não disponível.')}>
            <div className="ph-app-icone-img" style={{ background: '#333' }}>
              <Camera />
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
          <AIScanHighlight delay={0.3} block>
            <div className="ph-browser-url">
              <span className="ph-browser-lock"><Cadeado /></span>
              <span>gov.br</span>
            </div>
          </AIScanHighlight>
        </div>
        <div className="ph-browser-loading">
          <LoadingAcessivel mensagem="Conectando ao Gov.br..." />
          <div className="ph-browser-spinner" />
          <span>Carregando gov.br...</span>
          <Skeleton linhas={4} />
          <button className="ph-browser-cancel" onClick={() => setTela('home')}>Cancelar</button>
        </div>
      </div>
    );
  }

  if (tela === 'govbr') {
    return (
      <div className="ph-govbr" onPointerDownCapture={() => { if (autoRef.current) fimRef.current?.(); }}>
        <GovbrNativo onAvancar={abrirGovbr} onMensagem={anunciar} />
        <div className="ph-govbr-info">
          <p><Bullet /> Acesse mais de 4.000 serviços</p>
          <p><Bullet /> Segurança garantida</p>
        </div>
      </div>
    );
  }

  if (tela === 'concluido') {
    const nivelAtual = NIVEIS_CONTA[nivel];
    return (
      <div className="ph-sucesso">
        <SeloDemoGov />
        <div className="ph-sucesso-icone"><Estrela /></div>
        <h3>Conta aberta!</h3>
        <p>Você concluiu {servico.nome} com sucesso.</p>
        {servico.id === 'govbr' && (
          <div className="ph-nivel-card">
            <span className="ph-nivel-selo" style={{ background: nivelAtual.cor }}>
              Nível {nivelAtual.rotulo}
            </span>
            <p className="ph-nivel-desc">{nivelAtual.descricao}</p>
            <button
              type="button"
              className="ph-btn btn btn-outline-primary ph-nivel-toggle"
              aria-expanded={nivelAberto}
              onClick={() => {
                const caminhos = CAMINHOS_NIVEL.map(
                  (c) => `${NIVEIS_CONTA[c.para].rotulo}: ${c.fala}`,
                ).join('. ');
                anunciar(`Para aumentar o nível da sua conta, você pode: ${caminhos}.`);
                setNivelAberto(true);
              }}
            >
              <SobeNivel /> Aumentar nível
            </button>
            {nivelAberto && (
              <ul className="ph-nivel-caminhos">
                {CAMINHOS_NIVEL.map((c, i) => (
                  <li key={`${c.para}-${i}`}>
                    <strong>{NIVEIS_CONTA[c.para].rotulo}:</strong> {c.fala}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <AIScanHighlight delay={0.5} cor="var(--verde)">
          <button className="ph-btn btn btn-warning" onClick={() => { setTela('home'); setIndice(0); setValor(''); }}>
            Voltar ao início
          </button>
        </AIScanHighlight>
      </div>
    );
  }

  const progresso = Math.round(((indice + 1) / passos.length) * 100);

  return (
    <div className="ph-login" onPointerDownCapture={() => { if (autoRef.current) fimRef.current?.(); }}>
      {notif !== 'oculta' && (
        <NotificacaoAndroid
          remetente={servico.id === 'govbr' ? 'Gov.br' : 'SUS Digital'}
          codigo={servico.codigoSMS}
          aberta={notif === 'aberta'}
          onAbrir={() => {
            setNotif('aberta');
            anunciar(`Aqui está o código, gerado agora para você. Toque em Usar este código.`);
          }}
          onUsarCodigo={() => {
            setValor(servico.codigoSMS);
            setNotif('oculta');
            anunciar(`Código preenchido. Agora toque em Enviar, sem pressa.`);
          }}
          onFechar={() => setNotif('pip')}
        />
      )}
      <div style={{ background: 'var(--azul)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setTela('govbr')} aria-label="Voltar" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 4, color: '#fff' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <GovLogoWhite small />
        </div>
        <button aria-label="Menu" style={{ background: 'transparent', border: 'none', padding: 4, display: 'flex', cursor: 'pointer' }}>
          <Hamburger />
        </button>
      </div>
      <div style={{ height: 2, background: 'var(--amarelo)', flexShrink: 0 }} />
      <SeloDemoGov />
      <div style={{ padding: '10px 16px 0', textAlign: 'left' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--azul)' }}>Entrar com gov.br</span>
      </div>

      <div className="ph-login-progresso">
        <div className="ph-login-progresso-fill" style={{ width: `${progresso}%` }} />
      </div>
      <div className="ph-login-passo-texto">
        Passo {indice + 1} de {passos.length}
      </div>

      <div className="ph-login-dots">
        {passos.map((p, i) => (
          <span
            key={p.id}
            className={`ph-login-dot ${i === indice ? 'atual' : i < indice ? 'feito' : ''}`}
          />
        ))}
      </div>

      {passo.campo ? (
        <AIScanHighlight delay={0.2} block label={passo.campo.rotulo}>
          <div className="ph-login-campo--foco" style={{ margin: '10px 16px', background: 'var(--fundo)', border: 'none', padding: 0 }}>
            <label htmlFor={`campo-${passo.id}`} style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--azul)', marginBottom: 6 }}>
              {passo.campo.tipo === 'cpf' ? 'Digite seu CPF aqui' : passo.campo.rotulo}
            </label>
            <input
              id={`campo-${passo.id}`}
              name={passo.campo.tipo === 'cpf' ? 'cpf' : passo.campo.tipo === 'senha' ? 'password' : passo.campo.tipo === 'codigo' ? 'codigo' : passo.id}
              value={valor}
              onChange={(e) => {
                const novo = tratarValor(passo.campo?.tipo, e.target.value);
                setValor(novo);
                if (mostrarErro && valorValido(passo.campo?.tipo, novo)) {
                  setMostrarErro(false);
                  if (passo.campo?.tipo === 'codigo') setCodigoExpirado(false);
                }
              }}
              placeholder={passo.campo.exemplo}
              maxLength={passo.campo.tipo === 'cpf' ? 14 : passo.campo.tipo === 'codigo' ? 6 : 64}
              inputMode={passo.campo.tipo === 'senha' ? 'text' : 'numeric'}
              type={passo.campo.tipo === 'senha' ? 'password' : 'text'}
              autoComplete={passo.campo.tipo === 'cpf' ? 'username' : passo.campo.tipo === 'senha' ? 'current-password' : passo.campo.tipo === 'codigo' ? 'one-time-code' : 'off'}
              aria-invalid={mostrarErro || undefined}
              aria-describedby={mostrarErro && textoTraduzidoErro ? `erro-${passo.id}` : undefined}
className={`form-control ${mostrarErro ? 'is-invalid' : ''}`}
               style={{ borderColor: mostrarErro ? 'var(--vermelho)' : 'var(--amarelo)' }}
             />
            {mostrarErro && textoTraduzidoErro && (
              <p id={`erro-${passo.id}`} className="ph-login-campo-erro invalid-feedback">
                {textoTraduzidoErro}
              </p>
            )}
            <small style={{ display: 'block', marginTop: 6, color: 'var(--texto-secundario)', fontSize: '0.58rem' }}><Cadeado /> Dados ficam só neste aparelho</small>
            <button className="ph-btn btn btn-warning" onClick={enviar} disabled={enviando} style={{ marginTop: 10, width: '100%' }}>
              {enviando ? 'Enviando…' : 'Enviar'}
            </button>
            {passo.campo.tipo === 'codigo' && (
              <button type="button" className="ph-btn btn btn-link" onClick={reenviarCodigo} disabled={enviando}>
                Mandar outro código
              </button>
            )}
          </div>
        </AIScanHighlight>
      ) : (
        <div className="ph-login-info">
          {indice === passos.length - 1
            ? <><Estrela /> Conta aberta com sucesso!</>
            : 'Toque em "Continuar" para avançar.'}
        </div>
      )}

      {mostrarErro && passo.erroTecnico && (
        <div ref={erroResumoRef} tabIndex={-1} role="alert" aria-labelledby={`resumo-erro-tit-${passo.id}`} className="ph-login-erro">
          <h3 id={`resumo-erro-tit-${passo.id}`} className="ph-login-erro-titulo">
            Há um problema
          </h3>
          <div className="ph-login-erro-portal">
            <span className="ph-login-erro-icon"><X /></span>
            <button
              type="button"
              className="ph-login-erro-link"
              onClick={() => focarCampo(passo.id)}
            >
              {passo.campo?.rotulo ?? passo.id}: {textoTraduzidoErro}
            </button>
          </div>
          <div className="ph-login-erro-assistente">
            <span className="ph-login-erro-icon"><Robot /></span>
            <span>{passo.erroAmigavel}</span>
          </div>
          {passo.campo?.tipo === 'codigo' && (mostrarErro || codigoExpirado) && (
            <button type="button" className="ph-btn btn btn-link" onClick={reenviarCodigo} disabled={enviando}>
              Mandar outro código
            </button>
          )}
        </div>
      )}

      <div className="ph-login-botoes">
        <button className="ph-btn btn btn-outline-primary" onClick={voltar} disabled={indice === 0 || enviando}>
          <SetaEsq /> Voltar
        </button>
        <AIScanHighlight delay={0.4} label="continuar">
          <button className="ph-btn btn btn-warning" onClick={() => { if (passo.campo) enviar(); else avancar(); }} disabled={enviando}>
          {indice === passos.length - 1
            ? <><Estrela /> Concluir</>
            : <>Continuar <SetaDir /></>}
          </button>
        </AIScanHighlight>
      </div>

      {passo.erroAmigavel && !mostrarErro && (
        <button className="ph-btn btn btn-outline-danger" onClick={simularErro}>
          <Alerta /> Simular erro do portal
        </button>
      )}
    </div>
  );
}

