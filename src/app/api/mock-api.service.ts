import {ApiService} from './api.service';

export const MockApiStub = {
  login: (email: string, password: string) => {
    console.log('fake login');
  },
  createUser: (email: string, password: string, name: string) => {
    console.log('fake create user');
  }
};
