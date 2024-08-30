import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
type Seat = {
  rowCode: string;
  seatNumber: number;
  seatType: number; // 0 hoặc 1
  status: number; // 0 - available, 1 - reserved, 2 - chosen
};

@WebSocketGateway(3000, { cors: '*' })
export class className {
  @WebSocketServer()
  server;

  @SubscribeMessage('updateStatus')
  handleStatusUpdate(@MessageBody() data: { id: number; status: boolean }) {
    this.server.emit('statusUpdated', data);
  }
}
