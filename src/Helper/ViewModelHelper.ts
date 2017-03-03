import { DialogService } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ShowBusyBoxEvent } from '../Events/ShowBusyBoxEvent';
import { AppRouter } from 'aurelia-router';
import * as toastr from 'toastr';
import swal from 'sweetalert2';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from './ServiceHelper'
import {EntityManager, Entity, ValidationError, ValidationErrorsChangedEventArgs, PropertyChangedEventArgs} from 'breeze-client';

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

    //Aufrufen der zeitverzögerten Kindmethode
    setTimeout(() => {
      this.attachedChildTimeOut();
    }, 500);
  }

  //Muss von der Kindklasse überschrieben werden um spezifische
  //Attached Implementierungen auszuführen
  //(Ist abstract und muss überschrieben werden)
  protected abstract attachedChild(): void

  //Muss von der Kindklasse überschrieben werden um spezifische
  //Attached Implementierungen auszuführen
  //Diese Methode wird von Aurelia zeitverzögert ausgeführt
  //(Ist abstract und muss überschrieben werden)
  protected abstract attachedChildTimeOut(): void
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
  protected IDToSelect: any;
  protected selectedID: any;
  protected haveToSelectID: boolean;
 
  //Members für das Grid
  protected gridData: ej.DataManager;
  protected grid: ej.Grid;
  protected gridFilterSettings: ej.Grid.FilterSettings;
  protected gridGroupSettings: ej.Grid.GroupSettings;
  protected gridSortSettings: ej.Grid.SortSettings;
  protected gridEditSettings: ej.Grid.EditSettings;
  protected gridSelectionSettings: ej.Grid.SelectionSettings;
  protected gridScrollSettings: ej.Grid.ScrollSettings;

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

export abstract class ViewModelEdit extends ViewModelGeneralView {
    //Member-Deklarationen
    routeForList: string;
    router: AppRouter;
    itemToEdit: Entity;
    hasValidationErrors: boolean;
    validationErrors: Array<ValidationError>;
    isSavingEnabled: boolean;
    editMode: string;
    keySubscribePropertyChanged: number;
    keySubscribeErrorsChanged: number;

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, routeForList: string, router: AppRouter) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(localize, aggregator, dialog);

        //Übernehmen der Parameter
        this.routeForList = routeForList;
        this.router = router;

        //Initialisieren der Member
        this.hasValidationErrors = false;
    }

    //Wird aufgerufen wenn der Aurelia-Router Aurelia die View anzeigen möchte.
    //Hier können asynchrone Vorgänge durchgeführt werden
    public async activate(info: any): Promise<void> {
        if (info.operation == "new") {
            //Setzen des Edit-Modes
            this.editMode = "new";

            //Aufrufen der Methode zum Anlegen eines neuen Items
            if (info.idFather) {
                //Aufrufen der Methode zum Erzeugen eines neuen Elementes
                await this.createNew(info.idFather);

                //Löschen aller etwaiger Validierungsfehler bei einem neuen Item
                this.itemToEdit.entityAspect.clearValidationErrors();

                //Aufrufen der Child-Routine
                return this.activateChild(info);
            }
            else {
                //Aufrufen der Methode zum Erzeugen eines neuen Elementes
                await this.createNew();

                //Löschen aller etwaiger Validierungsfehler bei einem neuen Item
                this.itemToEdit.entityAspect.clearValidationErrors();

                //Aufrufen der Child-Routine
                return this.activateChild(info);
            }
        }
        else {
            //Setzen des Edit-Modes
            this.editMode = "edit";

            //Aufrufen der Lade-Methode und der Child-Methode
            if (info.idFather) {
                //Aufrufen der Methode zum Laden
                await this.load(info.id, info.idFather);
                   
                //Aufrufen der Child-Methode
                return this.activateChild(info);
            }
            else {
                //Aufrufen der Methode zum Laden
                await this.load(info.id);

                //Aufrufen der Child-Methode
                return this.activateChild(info);
            }
        }
    }

    //Laden der Daten über den Service (Ist abstract und muss überschrieben werden)
    protected abstract async load(id: number, idFather?: number): Promise<any>;

    //Ein neues Item erzeugen (Ist abstract und muss überschrieben werden
    protected abstract async createNew(idFather?: number): Promise<any>;
 
    //Wird von Aurelia aufgerufen um zu überprüfen ob durch den Router
    //diese View überhaupt verlassen werden darf. Hier muss entweder
    //True für Ja und False für Nein zurückgegeben werden
    private async canDeactivate(): Promise<boolean> {
       if (this.hasChanges()) {
         //Änderungen vorhanden, dann ausgeben einer Sicherheitsabfrage
         try
         {
              //Ausgeben der Warnmeldung
              await swal(
                {
                    titleText: this.loc.tr('Leave_Page.Question.Header', { ns: 'Alerts' }),
                    text: this.loc.tr('Leave_Page.Question.Body', { ns: 'Alerts' }),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: this.loc.tr('Leave_Page.Question.Confirm_Button', { ns: 'Alerts' }),
                    cancelButtonText: this.loc.tr('Leave_Page.Question.Cancel_Button', { ns: 'Alerts' }),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }
              );

            //Die Änderungen sollen verworfen werden
            this.rejectChanges();

            //Verlassen der View erlaubt
            return Promise.resolve(true);
         }
         catch(ex)
         {
              //Die View soll nicht verlassen werden
              return Promise.reject(false);
         }
       }
       else {
         //Keine Änderungen vorhanden, die View kann verlassen werden
         return Promise.resolve(true);
       }
    } 

    //Liefert zurück ob der Service aktuell ausstehende Änderungen hat (Ist abstract und muss überschrieben werden)
    protected abstract hasChanges(): boolean;

    //Verwerfen der Änderungen im Service (Ist abstract und muss überschrieben werden)
    protected abstract rejectChanges(): void;

    //Registriert sich für das Property-Changed Event von Breeze
    protected subscribePropertyChanged(): void {
        this.keySubscribePropertyChanged = this.itemToEdit.entityAspect.propertyChanged.subscribe(
          (eventArgs: PropertyChangedEventArgs) => {
            this.propertyChanged(eventArgs);
        });
    }

    //Wird aufgerufen wenn sich eine Property der Entität geändert hat. Hier müssen die Server-Validation-Errors
    //für die entsprechende Property gelöscht werden
    private propertyChanged(eventArgs: PropertyChangedEventArgs): void {
        var Errors: Array<ValidationError> = this.itemToEdit.entityAspect.getValidationErrors();
        for (var index in Errors) {
            if (Errors[index].propertyName == eventArgs.propertyName) {
                var Error: any = Errors[index];
                if (Error.isServerError) {
                    this.itemToEdit.entityAspect.removeValidationError(Errors[index]);
                }
            }
        }
    }

    //Registriert sich für das Validation Errors Changed Event von Breeze
    protected subscribeToValidationChanged(): void {
        //Für das Validation-Changed-Ereignis registrieren
        this.keySubscribeErrorsChanged = this.itemToEdit.entityAspect.validationErrorsChanged.subscribe(
          (eventArgs: ValidationErrorsChangedEventArgs) => {
            this.validationErrorsChanged(eventArgs);
        });

        //Initiales auslesen des Validierungszustandes
        this.hasValidationErrors = this.itemToEdit.entityAspect.hasValidationErrors;
        this.validationErrors = this.itemToEdit.entityAspect.getValidationErrors();
        this.checkEnabledState();
    }
  
    //Wird aufgerufen wenn sich die Validierungsfehler geändert haben
    private validationErrorsChanged(eventArgs: ValidationErrorsChangedEventArgs): void {
        this.hasValidationErrors = eventArgs.entity.entityAspect.hasValidationErrors;
        this.validationErrors = eventArgs.entity.entityAspect.getValidationErrors();
        this.checkEnabledState();
    }

    //Deregistrieren der Event-Handler
    protected unsubscribeEvents(): void {
        this.itemToEdit.entityAspect.propertyChanged.unsubscribe(this.keySubscribePropertyChanged);
        this.itemToEdit.entityAspect.validationErrorsChanged.unsubscribe(this.keySubscribeErrorsChanged);
    }

    //Muss von der Kind-Klasse überschrieben werden um
    //die Aktionen zum Speichern der Daten auszuführen
    //(Ist abstract und muss überschrieben werden)
    protected abstract async saveChanges(): Promise<void>;

    //Muss von der Kind-Klasse überschrieben werden um
    //die Aktionen zum Abbrechen des Editiermodus auszuführen
    //(Ist abstract und muss überschrieben werden)
    protected abstract cancelChanges(): void;
}

export abstract class ViewModelEditNormal extends ViewModelEdit {
    //Members
    service: ServiceModelStammdatenEditNormal;

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, routeForList: string, 
                router: AppRouter, service: ServiceModelStammdatenEditNormal) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(localize, aggregator, dialog, routeForList, router);

        //Übernehmen der Parameter
        this.service = service;
    }

    //Liefert zurück ob der Service aktuell ausstehende Änderungen hat
    protected hasChanges(): boolean {
        return this.service.hasChanges();
    }

    //Verwerfen der Änderungen im Service
    protected rejectChanges(): void {
        //Verwerfen der Änderungen
        this.service.rejectChanges();

        //Die-Events deregistrieren
        this.unsubscribeEvents();

        //Benachrichtigung, dass die Änderungen zurückgenommen wurden
        this.cancelChanges();
    }

    //Laden der Daten über den Service
    protected async load(id: number, idFather?: number): Promise<any> {
        //Deklaration
        var ResultSet: any;

        //Über Promise das Laden des zu editierenden Items anstoßen
        ResultSet = await this.service.getItem(id);

        //Übernehmen der Entity
        this.itemToEdit = ResultSet[0];

        //Verdrahten des Events für das Property-Changed Event
        this.subscribePropertyChanged();

        //Subscribe to Validation changed
        this.subscribeToValidationChanged();

        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }

    //Erstellt ein neues Item
    protected async createNew(idFather?: number): Promise<any> {
        //Übernehmen der Entity
        this.itemToEdit = await this.service.createNew();

        //Verdrahten des Events für das Property-Changed Event
        this.subscribePropertyChanged();

        //Subscribe to Validation changed
        this.subscribeToValidationChanged();

        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }
}
