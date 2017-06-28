import { SessionCache } from './SessionCache';
import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';
import { LoginModel } from './../Models/Auth/LoginModel';
import { RouteConfigAuth } from '../Config/RouteConfigAuth';

@autoinject()
export class AuthorizationHelper {
  //Member
  private client: HttpClient;

  //C'tor
  constructor (client: HttpClient) {
    //Übernehmen der Parameter
    this.client = client;
  }

  //Zusammenstellen des Bearer-Tokens
  private getAuthHeader(): string {
    //Token aus dem Storage ermitteln
    let accessToken = SessionCache.getAccessToken();

    //Aufbereiten des Tokens so dass es vom Server akzeptiert wird
    if (accessToken) {
      return `Bearer ${accessToken}`;
    }
    return null;
  }

  //Authentication-Info entfernen
  private clearAuthInfo(): void {
    //Token aus dem Storage entfernen
    SessionCache.removeAccessToken();

    //Setzen der Benutzerinfo auf NULL
    this.userInfo = null;
  }

  //User anmelden
  public login(model: LoginModel): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getLoginRoute())
      .asPost()
      .withContent($.param(
      {
                UserName: model.UserName,
                Password: model.Password,
                grant_type: 'password'
      }))
      .withHeader('Content-Type', 'application/x-www-form-urlencoded')
      .send();
  }

  //Den User abmelden
  public async logout(): Promise<HttpResponseMessage> {
    //Ermitteln des Auth-Headers mit dem Bearer-Token
    let authHeader = this.getAuthHeader();

    //Den Logout auf dem Server durchführen. Da es bei Token-Authentication keinen
    //wirklichen Logout gibt, werden hier ein paar obligatorische Sachen und Logging
    //auf dem Server durchgeführt
    try {
      let Result = await this.client
        .createRequest(RouteConfigAuth.getLogoutRoute())
        .asPost()
        .withHeader('Authorization', authHeader)
        .send();

        //Das Token aus dem Storage entfernen
        this.clearAuthInfo();

        //Das erfolgreiche Promise zurückliefern
        return Promise.resolve(Result);
    }
    catch (ex) {
      //Das Token aus dem Storage entfernen, auch wenn es einen Fehler auf dem Server
      //gegeben hat. Damit muss sich der User auf jeden Fall frisch anmelden.
      this.clearAuthInfo();

      throw ex;
    }
  }
}
