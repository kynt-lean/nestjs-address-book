import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ICurrentUser } from './current-user.interface';

@Injectable()
export class CurrentUserService {
  constructor(private readonly cls: ClsService) {}

  setCurrentUser(user: ICurrentUser) {
    this.cls.set('user', user);
  }

  getCurrentUser(): ICurrentUser | undefined {
    return this.cls.get('user');
  }
}
