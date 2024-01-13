import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CustomerDto } from 'src/mail/application/dto/customer.dto';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags("email")
@Controller('email')
export class MailController {
    constructor(
         @Inject('EMAIL_EVENT') private readonly kafkaClient: ClientKafka,
        @Inject(MailerService) private readonly mailerService: MailerService) { }

    async onModuleInit() {
        ['customer-create'].forEach((key) => this.kafkaClient.subscribeToResponseOf(`${key}`));
        await this.kafkaClient.connect();
    }

    @MessagePattern('customer-create')
    public async prueba(@Payload() message: CustomerDto) {
        this.mailerService.sendMail({
            to: message.email,
            subject: 'cliente creado',
            template: '/message',
            context: {
                name: message.name,
                lastname: message.lastname,
                address: message.address,
                document: message.document,
                phone: message.phone
            },
            
        })
    }
}
