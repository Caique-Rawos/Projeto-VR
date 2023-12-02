import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {
  /**
   * Verifica se o Id informado é um numero inteiro
   * @param idValue Id informado
   * @returns booleano informando se esta valido
   */
  isValidId(idValue: number): boolean {
    try {
      if (!idValue) {
        return false;
      }
      return Math.floor(idValue) == idValue;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se a Descricao informado não esta vazia
   * @param descValue descricao informada
   * @returns booleano informando se esta valido
   */
  isValidDesc(descValue: string): boolean {
    if (!descValue) {
      return false;
    }
    return descValue && descValue.trim() !== '';
  }

  /**
   * Verifica se o preço informado esta dentro dos parametros estabelecidos pelo banco de dados
   * @param priceValue preço definido
   * @returns booleano informando se esta valido
   */
  isValidPrice(priceValue: number): boolean {
    if (priceValue == undefined) {
      return false;
    }
    const stringValue = priceValue.toString();
    const [integerPart, decimalPart] = stringValue.split('.');

    if (integerPart.length > 10) {
      return false;
    }

    if (decimalPart && decimalPart.length > 3) {
      return false;
    }

    return true;
  }
}
