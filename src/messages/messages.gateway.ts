import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}
 

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.messagesService.create(payload);
    // after saving, retrieve the full conversation between author and receiver
    const conversation = await this.messagesService.findConversation(saved.author_id, saved.receiver_id);

    // Emit the conversation to sender and receiver using per-user event names: algo_<userId>
    const senderEvent = `chat_${saved.author_id}`;
    const receiverEvent = `chat_${saved.receiver_id}`;

    try {
      this.server.emit(senderEvent, conversation);
      if (saved.receiver_id !== saved.author_id) {
        this.server.emit(receiverEvent, conversation);
      }
    } catch (e) {
      // swallow socket errors; message is already persisted
    }

    return conversation;
  }

  // helper to notify two users from outside (e.g., REST controller)
  notifyUsers(message: any) {
    const senderEvent = `chat_${message.author_id}`;
    const receiverEvent = `chat_${message.receiver_id}`;
    this.server.emit(senderEvent, message);
    if (message.receiver_id !== message.author_id) {
      this.server.emit(receiverEvent, message);
    }
  }
}
