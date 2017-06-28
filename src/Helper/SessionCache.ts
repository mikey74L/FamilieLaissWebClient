export class SessionCache {
  //Speichert einen Wert entweder im Local-Storage oder im Session-Storage
  public static saveInStorage(identifier: string, value: any, persistent: boolean): void {
    if (persistent) {
      localStorage[identifier] = value;
    } else {
      sessionStorage[identifier] = value;
    }
  }

  //Ermittelt einen Wert aus dem Storage (entweder local oder session)
  public static getFromStorage(identifier: string): any {
    return sessionStorage[identifier] || localStorage[identifier];
  }

  //Löscht einen Wert aus dem Storage
  public static clearFromStorage(identifier: string): void {
    localStorage.removeItem(identifier);
    sessionStorage.removeItem(identifier);
  }

  //Speichert das Access-Token im Storage
  public static saveAccessToken(token: string, persistent: boolean): void {
    SessionCache.saveInStorage('accessToken', token, persistent);
  }

  //Ermittelt das Access-Token aus dem Storage
  public static getAccessToken(): string {
    return SessionCache.getFromStorage('accessToken');
  }

  //Entfernt das Access-Token aus dem Storage
  public static removeAccessToken(): void {
    SessionCache.clearFromStorage('accessToken');
  }
}
