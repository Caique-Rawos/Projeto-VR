import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultMessagesService {
  ID_ERROR_MSG: string = 'id invalido, esperando um integer';
  PRICE_ERROR_MSG: string = 'Preco invalido';
  DESC_ERROR_MSG: string = 'Descricao eh obrigatoria';
  NOT_FOUND_ERROR_MSG: string = 'Produto nao encontrado';
  INVALID_REQUEST_MSG: string = 'Requisicao Invalida';
}
