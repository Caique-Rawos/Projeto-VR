import { ApiProperty } from '@nestjs/swagger';

export class ProductsDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public desc: string;

  @ApiProperty()
  public price: number;
}
