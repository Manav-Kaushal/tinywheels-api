import { Controller, Get } from '@nestjs/common';

@Controller('/api')
export class AppController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Get('/login')
  login(): string {
    return 'login route';
  }
}
