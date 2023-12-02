import { Test, TestingModule } from '@nestjs/testing';
import { DefaultMessagesService } from './default-messages.service';

describe('DefaultMessagesService', () => {
  let service: DefaultMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultMessagesService],
    }).compile();

    service = module.get<DefaultMessagesService>(DefaultMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be "id invalido, esperando um integer"', () => {
    expect(service.ID_ERROR_MSG).toEqual('id invalido, esperando um integer');
  });

  it('should be "Preco invalido"', () => {
    expect(service.PRICE_ERROR_MSG).toEqual('Preco invalido');
  });

  it('should be "Descricao eh obrigatoria"', () => {
    expect(service.DESC_ERROR_MSG).toEqual('Descricao eh obrigatoria');
  });

  it('should be "Produto nao encontrado"', () => {
    expect(service.NOT_FOUND_ERROR_MSG).toEqual('Produto nao encontrado');
  });

  it('should be "Requisicao Invalida"', () => {
    expect(service.INVALID_REQUEST_MSG).toEqual('Requisicao Invalida');
  });
});
