export class RouteConfigAuth {
  //Members
  private static baseURL: string = 'http://localhost:51956/';
  private static registerRoute: string = "api/account/register";
  private static confirmAccountRoute: string = "api/account/ConfirmAccount";
  private static loginRoute: string = "/token";
  private static logoutRoute: string = "";
  private static userInfoRoute: string = "/api/account/GetUserInfo";
  private static getAllUsersRoute: string = "/api/account/getallusers";
  private static AllowAccountRoute: string = "/api/account/AllowAccount";
  private static LockAccountRoute: string = "/api/account/LockAccount";
  private static DeleteAccountRoute: string = "/api/account/DeleteAccount";
  private static ResetPasswordRoute: string = "/api/account/CreatePasswordResetToken";
  private static NewPasswordRoute: string = "api/account/NewPassword";

  public static getLoginRoute(): string {
    return RouteConfigAuth.baseURL + RouteConfigAuth.loginRoute;
  }

  public static getRegisterRoute(): string {
    return RouteConfigAuth.baseURL + RouteConfigAuth.registerRoute;
  }

  public static getLogoutRoute(): string {
    return RouteConfigAuth.baseURL + RouteConfigAuth.logoutRoute;
  }
}
