import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDeveloper(): { Developer: string } {
    return { Developer: 'Caique Caires Ramos' };
  }
}
