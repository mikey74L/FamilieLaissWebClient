import { UserInfo } from '../Models/Auth/UserInfo';

export class UserInfoChangedEvent {
    //Members
    public userInfo: UserInfo;

    //C'tor
    constructor(userInfo: UserInfo) {
      this.userInfo = userInfo;
    }
}
