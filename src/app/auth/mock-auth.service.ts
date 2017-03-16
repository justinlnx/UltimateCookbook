import {AuthService} from './auth.service';

export class MockAuthService extends AuthService {
  public login(email: string, password: string) {
    console.log('fake login');
  }

  public createUser(email: string, password: string) {
    console.log('fake create user');
  }
}
