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
      // this.disconnectSocketIfPossible();

      this.user = user;
      let userId = user.id;

      this.currentUserChatroomsObservable = this.chatroomsObservableFactory(userId);

      return this.currentUserChatroomsObservable;
    });
  }

  public getCurrentUserChatroomObservable(chatroomId: string): Observable<Observable<Chatroom>> {
    return this.getCurrentUserChatroomsObservable().map((chatroomsObservable) => {
      return chatroomsObservable.map((chatrooms) => {
        return chatrooms.find((chatroom) => chatroom.$key === chatroomId);
      });
    });
  }

  public getOtherUseObservable(chatroomObservable: Observable<Chatroom>): Observable<User> {
    let usersInfoObservable = Rx.Observable.combineLatest(
        chatroomObservable, this.apiService.getUserInfoListObservable().first(),
        (chatroom: Chatroom, users: User[]) => {
          let userIds = chatroom.users;

          return userIds.map((userId) => {
            return users.find((user) => user.id === userId);
          });
        });

    return Rx.Observable.combineLatest(
        usersInfoObservable, this.apiService.getCurrentUserObservable().first(),
        (users: User[], currentUser: User) => {
          return users.find((user) => user.id !== currentUser.id);
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

  private newMessageEvent(userId: string): string {
    return `new message+${userId}`;
  }

  private disconnectSocketIfPossible(): void {
    if (this.chatroomSocket) {
      this.chatroomSocket.disconnect();
    }
  }

  private chatroomsObservableFactory(userId: string): Observable<Chatroom[]> {
    let rawChatroomsObservable: Observable<ChatroomSchema[]> = Rx.Observable.create((observer) => {
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
      };
    });

    return Mapper.mapListObservable(rawChatroomsObservable, chatroomRetrieveScheme);
  }
}
