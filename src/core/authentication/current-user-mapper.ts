import { ICurrentUser } from './current-user.interface';

export type CurrentUserMapper = (user: Express.User) => ICurrentUser;
