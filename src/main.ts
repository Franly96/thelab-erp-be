import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  //cors for react app consumption
  app.enableCors({
    origin: '*', // Allow all origins - adjust as needed for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, // Allow sending cookies/auth tokens
  });

  const config = new DocumentBuilder()
    .setTitle('ERP TheLab API')
    .setDescription('TheLab ERP API description')
    .setVersion('1.0')
    .addTag('erp-thelab')
    .build();

  const options: SwaggerDocumentOptions = {};

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
