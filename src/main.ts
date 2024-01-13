import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservices = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'kafka-mail-consumer-nest',
        },
        subscribe: {
          fromBeginning: true
        }
      },
    },
  );
  await microservices.listen();
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Email API')
    .setDescription('The email API description')
    .setVersion('1.0')
    .addTag('mail')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3200);
}
bootstrap();
