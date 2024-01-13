import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from "@nestjs/common";
import { MailController } from './infraestructura/controllers/mail.controller';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_EVENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'email',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'email-consumer',
          },
        },
      },
    ]),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'jose1990reccio@gmail.com',
            pass: 'vhgfhwqllyzdzfna',
          },
        },
        defaults: {
          from: '"No Reply" <<noreply@example.com>>',
        },
        template: {
          dir: join(__dirname, './templates'),
          options: {
            strict: true,
          },
        },
      }),
      inject: [],
    }),
  ],
  controllers: [MailController]
})
export class MailModule { }
