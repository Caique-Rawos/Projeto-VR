import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('App example')
      .setDescription('The App API description')
      .setVersion('1.0')
      .addTag('App')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
