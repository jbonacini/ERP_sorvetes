export class CreateProdutoDto {
    empresaId: string;
    nome: string;
    codigo?: string;
    descricao?: string;
    tipo: string;
    unidade: string;
    precoCusto?: number;
    precoVenda?: number;
    estoqueMinimo?: number;
    categoriaId?: string;
}
