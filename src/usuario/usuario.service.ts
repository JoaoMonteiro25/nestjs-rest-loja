import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CriaUsuarioDTO } from "./dto/CriaUsuario.dto";
import { UsuarioEntity } from "./usuario.entity";
import { v4 as uuid } from 'uuid';
import { ListaUsuarioDTO } from "./dto/ListaUsuario.dto";
import { UsuarioRepository } from "./usuario.repository";
import { AtualizaUsuarioDTO } from "./dto/AtualizaUsuario.dto";

@Injectable()
export class UsuarioService{
    constructor(private usuarioRepository: UsuarioRepository){}

    async criaUsuario(dadosDoUsuario: CriaUsuarioDTO)
    {
        const usuarioEntity = new UsuarioEntity();

        try{

        usuarioEntity.email = dadosDoUsuario.email;
        usuarioEntity.senha = dadosDoUsuario.senha;
        usuarioEntity.nome = dadosDoUsuario.nome;
        usuarioEntity.id = uuid();

        this.usuarioRepository.salvar(usuarioEntity);
        return {
          usuario: new ListaUsuarioDTO(usuarioEntity.id, usuarioEntity.nome),
          messagem: 'Usuário criado!',
        };
      } catch (error) {
          throw new BadRequestException("Erro na criação do usuário!");
      }
    }

    async listaUsuario(){
    try {
        const usuariosGravados = await this.usuarioRepository.listar();
        return usuariosGravados.map((usuario) => new ListaUsuarioDTO(usuario.id, usuario.nome));
    } catch (error) {
        throw new BadRequestException("Erro ao listar usuários!");
    }
  }
    async atualizaUsuario(id: string, novosDados:  Partial<UsuarioEntity>)
    {
        const verificaUsuario = await this.usuarioRepository.buscaPorId(id);
      if (!verificaUsuario) {
          throw new NotFoundException("Usuário não encontrado")
      }
      try {
        const usuarioAtualizado = await this.usuarioRepository.atualiza(id, novosDados);
        return {
            usuario: usuarioAtualizado,
            menssagem: 'Usuário atualizado com sucesso',
          };
    } catch (error) {
      throw new BadRequestException("Erro ao atualiza usuário");      
    }
  }

    async removeUsuario(id: string){
    const existeUsuario = await this.usuarioRepository.buscaPorId(id);
    if (!existeUsuario) {
        throw new NotFoundException("Usuário não foi encontrado")
    }
    try {
        const usuarioRemovido = await this.usuarioRepository.remove(id);
        return {
        usuario: usuarioRemovido,
        messagem: 'Usuário removido',
        };
    } catch (error) {
      throw new BadRequestException("Erro na exclusão do usuário");    
    }
  }
}