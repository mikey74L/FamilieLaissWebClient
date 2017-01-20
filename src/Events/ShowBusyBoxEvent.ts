export class ShowBusyBoxEvent {
  //Members
  public isVisible: boolean;

  //C'tor
  constructor(visible: boolean) {
    //Übernehmen der Parameter
    this.isVisible = visible;
  }
}
