import { ApiProperty } from '@nestjs/swagger';

export class ProductsDto {
  @ApiProperty()
  public desc: string;

  @ApiProperty()
  public price: number;
}
