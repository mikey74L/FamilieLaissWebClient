import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {ViewModelGeneral} from '../Helper/ViewModelHelper';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

@autoinject()
export class PictureShow extends ViewModelGeneral {
  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator) {
    //Aufrufen des Vaters
    super(localize, eventAggregator);
  }

  //Wird von der Vater-Klasse aufgerufen wenn die View vom Router
  //aktiviert wird aber noch nicht angezeigt. 
  protected async activateChild(info: any): Promise<void> {
  }

  //Wird vom Framework aufgerufen wenn sich der isBusy-Status geändert hat
  protected busyStateChanged(): void {
  }

  //Überprüft den Enabled State
  protected checkEnabledState(): void {
  }
}
