import { Controller, Get, Post, Body, Param, Header } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesGateway } from './messages.gateway';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  async create(@Body() dto: CreateMessageDto) {
    const saved = await this.messagesService.create(dto);
    // notify sender and receiver via websocket events
    try {
      this.messagesGateway.notifyUsers(saved);
    } catch (e) {
      // ignore notify errors
    }
    return saved;
  }

  @Get('conversation/:id1/:id2')
  findConversation(@Param('id1') id1: string, @Param('id2') id2: string) {
    return this.messagesService.findConversation(id1, id2);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.messagesService.findByUser(userId);
  }

  @Get()
  findAll() {
    return this.messagesService.findByUser();
  }
}
