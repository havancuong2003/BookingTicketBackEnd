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

@WebSocketGateway(3001, { cors: '*' })
export class ChooseChairGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('updateStatus')
  handleStatusUpdate(@MessageBody() data: { id: number; status: boolean }) {
    // Phát thông báo đến tất cả các client về thay đổi trạng thái
    this.server.emit('statusUpdated', data);
  }
}
