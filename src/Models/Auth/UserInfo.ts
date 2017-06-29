export class UserInfo {
  public userName: string;
  public firstName: string;
  public familyName: string;
  public roles: Array<string>;

  constructor(userName: string, firstName: string, familyName: string, roles: string) {
    this.userName = userName;
    this.firstName = firstName;
    this.familyName = familyName;
    this.roles = (typeof (roles) === "string") ? roles.toString().split(",") : roles;
  }
}
