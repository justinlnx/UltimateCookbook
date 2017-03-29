import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import * as io from 'socket.io-client';

import {ApiService} from './api.service';
import {Chatroom, chatroomRetrieveScheme, ChatroomSchema, Mapper, User} from './objects';

const CHATROOM_SOCKET_NAMESPACE = '/chat';

@Injectable()
export class ChatroomService {
  private chatroomSocket: SocketIOClient.Socket;
  private user: User;
  private currentUserChatroomsObservable: Observable<Chatroom[]>;

  constructor(public apiService: ApiService) {}

  public getCurrentUserChatroomsObservable(): Observable<Observable<Chatroom[]>> {
    return this.apiService.getCurrentUserObservable().map((user) => {
      this.user = user;
      let userId = user.id;
      let rawChatroomsObservable: Observable<ChatroomSchema[]> =
          Rx.Observable.create((observer) => {
            this.chatroomSocket = io(CHATROOM_SOCKET_NAMESPACE);

            this.chatroomSocket.emit(this.registerEvent(), {userId: userId}, (ack) => {
              console.log(ack);

              this.chatroomSocket.on(this.getChatroomsEvent(userId), (chatrooms) => {
                console.log(chatrooms);

                observer.next(chatrooms);
              });
            });

            return () => {
              this.chatroomSocket.disconnect();
            }
          });

      this.currentUserChatroomsObservable =
          Mapper.mapListObservable(rawChatroomsObservable, chatroomRetrieveScheme);

      return this.currentUserChatroomsObservable;
    });
  }

  public createNewChatroom(otherUserId: string): void {
    this.chatroomSocket.emit(this.newChatEvent(this.user.id), {other: otherUserId});
  }

  private registerEvent(): string {
    return 'register';
  }

  private newChatEvent(userId: string): string {
    return `new chat+${userId}`;
  }

  private getChatroomsEvent(userId: string): string {
    return `chatrooms+${userId}`;
  }

  private disconnectSocketIfPossible(): void {
    if (this.chatroomSocket) {
      this.chatroomSocket.disconnect();
    }
  }
}
