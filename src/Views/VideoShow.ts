import {inject, NewInstance} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {ViewModelGeneral} from '../Helper/ViewModelHelper';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import { ValidationController } from 'aurelia-validation';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController))
export class VideoShow extends ViewModelGeneral {
  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController) {
    //Aufrufen des Vaters
    super(localize, eventAggregator, validationController);
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
