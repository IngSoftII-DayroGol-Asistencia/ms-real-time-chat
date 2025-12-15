import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: dto.content,
        author_id: dto.author_id,
        receiver_id: dto.receiver_id,
      },
    });
  }

  async findByUser(userId?: string) {
    if (!userId) return this.prisma.message.findMany({ orderBy: { createdAt: 'asc' } });
    return this.prisma.message.findMany({
      where: {
        OR: [
          { author_id: userId },
          { receiver_id: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findConversation(id1: string, id2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { author_id: id1 },
              { receiver_id: id2 },
            ],
          },
          {
            AND: [
              { author_id: id2 },
              { receiver_id: id1 },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
