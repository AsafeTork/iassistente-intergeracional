export type Passo = {
  id: string;
  titulo: string;
  instrucaoAmigavel: string;
  detalhe: string;
  campo?: { rotulo: string; exemplo: string; tipo: 'cpf' | 'senha' | 'codigo' | 'texto' };
  erroTecnico?: string;
  erroAmigavel?: string;
};

export const PASSOS_GOVBR: Passo[] = [
  {
    id: 'cpf',
    titulo: 'Digitar o CPF',
    instrucaoAmigavel: 'Insira o número do seu CPF no espaço indicado com a borda amarela.',
    detalhe: 'Só números, sem pontos nem traço. O campo fica grande e com borda amarela bem visível.',
    campo: { rotulo: 'CPF', exemplo: '123.456.789-00', tipo: 'cpf' },
    erroTecnico: 'Erro 400: documento inválido.',
    erroAmigavel:
      'Ops! Parece que faltou algum número do CPF. Vamos conferir juntos, sem pressa: conte 11 números.',
  },
  {
    id: 'senha',
    titulo: 'Digitar a senha',
    instrucaoAmigavel: 'Agora digite sua senha devagar. Ninguém está vendo: seus dados ficam no seu aparelho.',
    detalhe:
      'O filtro de privacidade do protótipo mostra que senhas nunca saem do aparelho neste exemplo.',
    campo: { rotulo: 'Senha', exemplo: '••••••••', tipo: 'senha' },
    erroTecnico: 'Credenciais inválidas. Tentativas restantes: 2.',
    erroAmigavel:
      'Essa senha não combinou. Que tal tentar de novo com calma? Se precisar, peça ajuda ao seu tutor jovem.',
  },
  {
    id: 'codigo',
    titulo: 'Código do celular (2 etapas)',
    instrucaoAmigavel: 'Olhe o SMS que chegou no seu celular e digite os 6 números aqui.',
    detalhe: 'O assistente lê os números em voz alta para conferência, se você permitir.',
    campo: { rotulo: 'Código de 6 números', exemplo: '4 8 2 9 1 6', tipo: 'codigo' },
    erroTecnico: 'Token expirado. Solicite novo código.',
    erroAmigavel:
      'Esse código venceu porque demorou um pouquinho. Não tem problema! Toque em "mandar outro código".',
  },
  {
    id: 'pronto',
    titulo: 'Pronto! Conta aberta',
    instrucaoAmigavel: 'Parabéns! Você entrou com sucesso. O assistente registrou cada etapa para seu tutor ver.',
    detalhe: 'No app real, o progresso é salvo para a tutoria reversa acompanhar sua evolução.',
  },
];

export type ServicoPortal = {
  id: string;
  nome: string;
  categoria: string;
  dificuldade: 'Fácil' | 'Médio' | 'Com ajuda';
  passos: number;
};

export const SERVICOS: ServicoPortal[] = [
  { id: 'aposentadoria', nome: 'Consultar aposentadoria (INSS)', categoria: 'Previdência', dificuldade: 'Com ajuda', passos: 6 },
  { id: 'sus', nome: 'Agendar consulta no SUS', categoria: 'Saúde', dificuldade: 'Médio', passos: 4 },
  { id: 'enem', nome: 'Ver resultado do ENEM', categoria: 'Educação', dificuldade: 'Médio', passos: 4 },
  { id: 'iptu', nome: 'Emitir 2ª via de boleto', categoria: 'Finanças', dificuldade: 'Fácil', passos: 3 },
  { id: 'titulo', nome: 'Consultar local de votação', categoria: 'Cidadania', dificuldade: 'Fácil', passos: 3 },
  { id: 'carteira', nome: 'Carteira de trabalho digital', categoria: 'Trabalho', dificuldade: 'Médio', passos: 5 },
];

export type Tutor = {
  id: string;
  nome: string;
  idade: number;
  escola: string;
  especialidade: string;
  avaliacao: number;
};

export const TUTORES: Tutor[] = [
  { id: 't1', nome: 'Ana Beatriz', idade: 16, escola: 'IFPA Bragança', especialidade: 'Gov.br e INSS', avaliacao: 4.9 },
  { id: 't2', nome: 'Carlos Eduardo', idade: 17, escola: 'IFPA Bragança', especialidade: 'Saúde e SUS', avaliacao: 4.8 },
  { id: 't3', nome: 'Mariana Silva', idade: 15, escola: 'E. E. Luiz Paulino Mártires', especialidade: 'Banco e boletos', avaliacao: 5.0 },
];

export const REQUISITOS = {
  funcionais: [
    { codigo: 'RF01', texto: 'Extrair e interpretar a árvore DOM de páginas web ativas' },
    { codigo: 'RF02', texto: 'Traduzir termos burocráticos com PNL adaptativa' },
    { codigo: 'RF03', texto: 'Feedback multimodal: síntese de voz + realce visual de elementos' },
  ],
  naoFuncionais: [
    { codigo: 'RNF01', texto: 'Baixo consumo local: processamento pesado na nuvem' },
    { codigo: 'RNF02', texto: 'Explicabilidade das decisões da IA' },
    { codigo: 'RNF03', texto: 'Privacidade local: sem envio de senhas e dados sensíveis' },
  ],
};
