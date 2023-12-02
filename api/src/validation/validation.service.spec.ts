import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /*
    +---------------------+
    |      VALID IDS      |
    +---------------------+
  */

  it('should return true on isValidId (1)', async () => {
    const bool = await service.isValidId(1);

    expect(bool).toEqual(true);
  });

  it('should return false on isValidId (1.3)', async () => {
    const bool = await service.isValidId(1.3);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidId (undefined)', async () => {
    const bool = await service.isValidId(undefined);

    expect(bool).toEqual(false);
  });

  /*
      +---------------------+
      |     VALID PRICE     |
      +---------------------+
    */

  it('should return true on isValidPrice (99.9)', async () => {
    const bool = await service.isValidPrice(99.9);

    expect(bool).toEqual(true);
  });

  it('should return true on isValidPrice (0.001)', async () => {
    const bool = await service.isValidPrice(0.001);

    expect(bool).toEqual(true);
  });

  it('should return true on isValidPrice (1234567890.999)', async () => {
    const bool = await service.isValidPrice(1234567890.999);

    expect(bool).toEqual(true);
  });

  it('should return true on isValidPrice (1234567890.999)', async () => {
    const bool = await service.isValidPrice(0);

    expect(bool).toEqual(true);
  });

  it('should return false on isValidPrice (mock invalid price)', async () => {
    const bool = await service.isValidPrice(12345678901.001);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (0.0009)', async () => {
    const bool = await service.isValidPrice(0.0009);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (12345678901)', async () => {
    const bool = await service.isValidPrice(12345678901);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (1234567890.5426)', async () => {
    const bool = await service.isValidPrice(1234567890.5426);

    expect(bool).toEqual(false);
  });

  it('should return false on isValidPrice (undefined)', async () => {
    const bool = await service.isValidPrice(undefined);

    expect(bool).toEqual(false);
  });

  /*
      +----------------------+
      |      VALID DESC      |
      +----------------------+
    */

  it('should return true on isValidDesc (Produto Teste)', async () => {
    const bool = await service.isValidDesc('Produto Teste');

    expect(bool).toEqual(true);
  });

  it('should return true on isValidDesc (test)', async () => {
    const bool = await service.isValidDesc('test');

    expect(bool).toEqual(true);
  });

  it('should return true on isValidDesc (t)', async () => {
    const bool = await service.isValidDesc('t');

    expect(bool).toEqual(true);
  });

  it('should return false on isValidDesc (empty string)', async () => {
    const bool = await service.isValidDesc('');

    expect(bool).toEqual(false);
  });

  it('should return false on isValidDesc (spaces)', async () => {
    const bool = await service.isValidDesc('   ');

    expect(bool).toEqual(false);
  });

  it('should return false on isValidDesc (undefined)', async () => {
    const bool = await service.isValidDesc(undefined);

    expect(bool).toEqual(false);
  });
});
