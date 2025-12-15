import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
