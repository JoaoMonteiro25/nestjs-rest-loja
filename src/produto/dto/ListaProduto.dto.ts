class ListaCaracteristicaProdutoDTO {
  nome: string;
  descricao: string;
}

class ListaImagemProdutoDTO {
  url: string;
  descricao: string;
}

export class ListaProdutoDTO {
  constructor(
    readonly id: string, 
    readonly usuarioId?: string,
    readonly nome?: string,
    readonly valor?: number,
    readonly quantidade?: number,
    readonly descricao?: string,
    readonly categoria?: string,
    readonly caracteristicas?: ListaCaracteristicaProdutoDTO[],
    readonly imagens?: ListaImagemProdutoDTO[],
  ) {}
}