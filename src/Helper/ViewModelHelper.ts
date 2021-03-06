import { DialogService } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ShowBusyBoxEvent } from '../Events/ShowBusyBoxEvent';
import { AppRouter } from 'aurelia-router';
import * as toastr from 'toastr';
import { ServiceModelStammdatenNormal } from './ServiceHelper'

export abstract class ViewModelGeneral {
  //Members
  protected loc: I18N;
  protected eventAggregator: EventAggregator;
  public isBusy: boolean;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator) {
    //Übernehmen der Parameter
    this.loc = loc;
    this.eventAggregator = eventAggregator;
    this.isBusy = false;
  }

  //Muss von der Kind-Klasse überschrieben werden um spezifische
  //Aktionen während des Activate-Vorgangs von Aurelia durchzuführen
  //(Ist abstract und muss überschrieben werden)
  protected abstract async activateChild(info: any): Promise<void>

  //Zeigt ein Info-Toastr an
  protected showNotifyInfo(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(5000);

    //Anzeigen des Toasts
    toastr.info(message);
  }

  //Zeigt ein Erfolgs-Toastr an
  protected showNotifySuccess(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(10000);

    //Anzeigen des Toasts
    toastr.success(message);
  }

  //Zeigt ein Error-Toastr an
  protected showNotifyError(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(10000);

    //Anzeigen des Toasts
    toastr.error(message);
  }

  //Zeigt ein Warning-Toastr an
  protected showNotifyWarning(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(5000);

    //Anzeigen des Toasts
    toastr.warning(message);
  }

  //Liefert ein Objekt für die Notify-Optionen zurück
  private setToastrOptions(delayTime: number): void {
    toastr.options.closeButton = false;
    toastr.options.debug = false;
    toastr.options.newestOnTop = true;
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-top-right";
    toastr.options.preventDuplicates = false;
    toastr.options.showDuration = 300;
    toastr.options.hideDuration = 300;
    toastr.options.timeOut = delayTime;
    toastr.options.extendedTimeOut = 1000;
    toastr.options.showEasing = "swing";
    toastr.options.hideEasing = "linear";
    toastr.options.showMethod = "slideDown";
    toastr.options.hideMethod = "slideUp";
  }

  //Anzeigen oder verbergen des Busy-Indicators in der Top-Bar
  //Dieses wird über den Event-Aggregator gesteuert
  protected setBusyState(state: boolean): void {
    //Den Event-Aggregator aufrufen
    this.eventAggregator.publish(new ShowBusyBoxEvent(state));

    //Setzen der Property
    this.isBusy = state;

    //Aufrufen der Methode für die Kinder
    this.busyStateChanged();

    //Den Enabled-State überprüfen
    this.checkEnabledState();
  }

  //Muss vom Kind überschrieben werden um den Enabled-State zu überprüfen
  //(Ist abstract und muss überschrieben werden)
  protected abstract checkEnabledState(): void

  //Wird aufgerufen wenn sich der Busy-State geändert hat
  //(Ist abstract und muss überschrieben werden)
  protected abstract busyStateChanged(): void
}

export abstract class ViewModelGeneralView extends ViewModelGeneral {
  //Members
  dialogService: DialogService;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, dialogService: DialogService) {
    //Aufrufen des Constructors der Vater-Klasse
    super(loc, eventAggregator);

    //Übernehmen der restlichen Parameter
    this.dialogService = dialogService;
  }

  //Wird von Aurelia aufgerufen bevor die View zum DOM attached wird
  public attached(): void {
    //Aufrufen der Attached Implementierung für die Kindklasse
    this.attachedChild();
  }

  //Muss von der Kindklasse überschrieben werden um spezifische
  //Attached Implementierungen auszuführen
  //(Ist abstract und muss überschrieben werden)
  protected abstract attachedChild(): void
}

export abstract class GridViewModelStammdaten extends ViewModelGeneralView {
  //Member-Deklarationen
  protected router: AppRouter;
  protected routeForEdit: string;
  protected entities: Array<any>;
  protected isItemSelected: boolean;
  public isAddEnabled: boolean;
  public isEditEnabled: boolean;
  public isDeleteEnabled: boolean;
  public isRefreshEnabled: boolean;
  protected idToSelect: any;
  protected haveToSelectID: boolean;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, dialogService: DialogService, routeForEdit: string, router: AppRouter) {
    //Aufrufen des Konstruktors für die Vater Klasse
    super(loc, eventAggregator, dialogService);

    //Übernehmen der Parameter
    this.routeForEdit = routeForEdit;
    this.router = router;
  }

  //Wird aufgerufen wenn der Aurelia-Router die View anzeigen möchte.
  //Hier können asynchrone Vorgänge durchgeführt werden
  public async activate(info: any): Promise<void> {
    //Aufrufen der Lade-Methode
    await this.load(info);

    //Aufrufen der Child-Methode
    await this.activateChild(info);
  }

  //Laden der Daten
  //Ist abstract und muss überschrieben werden
  protected abstract async load(info: any): Promise<void>; 
}

export abstract class GridViewModelStammdatenNormal extends GridViewModelStammdaten {
  //Members
  service: ServiceModelStammdatenNormal;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, dialogService: DialogService, routeForEdit: string, 
              router: AppRouter, service: ServiceModelStammdatenNormal) {
    //Aufrufen des Konstruktors für die Vater Klasse
    super(loc, eventAggregator, dialogService, routeForEdit, router);

    //Übernehmen der Parameter
    this.service = service;
  }

  //Laden der Daten über den Service
  protected async load(info: any): Promise<void> {
    //Laden der Daten über Service anstoßen
    this.entities = await this.service.getData();
  }
}
