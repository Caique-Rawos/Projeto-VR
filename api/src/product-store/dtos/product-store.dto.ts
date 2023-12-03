import { ApiProperty } from '@nestjs/swagger';

export class ProductStoreDto {
  @ApiProperty()
  public sell: number;

  @ApiProperty()
  public idProduct: number;

  @ApiProperty()
  public idStore: number;
}
