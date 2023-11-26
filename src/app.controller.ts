import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Informa o nome do desenvolvedor desta API' })
  getDeveloper(): { Developer: string } {
    return this.appService.getDeveloper();
  }
}
