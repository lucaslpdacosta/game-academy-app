export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  EsqueceuSenha: undefined;
  AlterarSenha: { email: string };
  Cadastro: undefined;
  Main: undefined;
  Home: undefined;
  Perfil: undefined;
  Win: undefined;
  Fail: undefined;
  Conteudo: { moduloId: string; titulo: string; meta: number };
  ConteudoDetalhe: { moduloId: string; conteudoId: string };
  Teste: { ModuloId: string; conteudoId: string };
  NovoModulo: undefined;
  NovoConteudo: { moduloId: string };
  NovoTeste: { moduloId: string; conteudoId: string };
  Opcoes: undefined;
};
