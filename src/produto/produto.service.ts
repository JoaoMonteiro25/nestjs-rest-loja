import { BadRequestException, Injectable } from "@nestjs/common";
import { ProdutoRepository } from "./produto.repository";
import { ProdutoEntity } from "./produto.entity";
import { ListaProdutoDTO } from "./dto/ListaProduto.dto";
import { AtualizaProdutoDTO } from "./dto/atualizaProduto.dto";
import { randomUUID } from "crypto";
import { CriaProdutoDTO } from "./dto/CriaProduto.dto";

@Injectable()
export class ProdutoService {
    constructor(private produtoRepository: ProdutoRepository) {}

    async criaNovo(dadosProduto: CriaProdutoDTO) {
        const produto = new ProdutoEntity();
        try {
            produto.id = randomUUID();
            produto.nome = dadosProduto.nome;
            produto.usuarioId = dadosProduto.usuarioId;
            produto.valor = dadosProduto.valor;
            produto.quantidade = dadosProduto.quantidade;
            produto.descricao = dadosProduto.descricao;
            produto.categoria = dadosProduto.categoria;
            produto.caracteristicas = dadosProduto.caracteristicas;
            produto.imagens = dadosProduto.imagens;

            this.produtoRepository.salva(produto);
            return {
                produto: new ListaProdutoDTO(produto.id, produto.usuarioId, produto.nome),
                messagem: 'Produto criado com sucesso',
            };
        } catch (error) {
            throw new BadRequestException("Erro ao criar produto!");
        }
    }
        
    async listaTodos() {
        return this.produtoRepository.listaTodos();
    }

    async getProdutosPaginados(pagina: number = 1, limite: number = 5) {
        const indexInicial = (pagina - 1) * limite;
        const indexFinal = indexInicial + limite;
        const produtos = this.produtoRepository.listaTodos();
        const produtosPaginados = produtos.slice(indexInicial, indexFinal);
    
        return {
          total: produtos.length,
          pagina,
          limite,
          produtos: produtosPaginados,
        };
      }

    async atualiza(id: string, dadosProduto: AtualizaProdutoDTO) {
        try {
            const produtoAlterado = await this.produtoRepository.atualiza(id,dadosProduto);
            return {
                mensagem: 'produto atualizado com sucesso',
                produto: produtoAlterado,
            };
        } catch (error) {
            throw new BadRequestException("Erro ao atualizar produto!");

        }
    }

    async remove(id: string) {
        try {
            const produtoRemovido = await this.produtoRepository.remove(id);
            return {
            mensagem: 'Produto removido com sucesso',
            produto: produtoRemovido,
            };            
        } catch (error) {
            throw new BadRequestException("Erro ao excluir produto!");
        }
    }

}