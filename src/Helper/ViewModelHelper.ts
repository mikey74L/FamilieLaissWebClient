import { Entity } from 'aurelia-orm';
/// <reference path="../../typings/globals/syncfusion/ej.web.all.d.ts" />
import { ToastrHelper } from './ToastrHelper';
import { DialogService } from 'aurelia-dialog';
import { ValidationController, validateTrigger } from 'aurelia-validation';
import { BSInputFieldErrorRenderer } from '../Renderer/BSInputFieldErrorRenderer';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ShowBusyBoxEvent } from '../Events/ShowBusyBoxEvent';
import { AppRouter } from 'aurelia-router';
import { DialogController } from 'aurelia-dialog';
import swal from 'sweetalert2';
import { enViewModelEditMode } from '../Enum/FamilieLaissEnum';
import { LoadDataWithFatherModel, EditDataWithFatherModel} from '../Models/LoadDataWithFatherModel';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal, 
         ServiceModelStammdatenID, ServiceModelStammdatenEditID,
         ServiceModelLoadDataDelete, ServiceModelAssign, ServiceModelAssignEdit } from './ServiceHelper'

export abstract class ViewModelGeneral {
  //Members
  protected loc: I18N;
  protected eventAggregator: EventAggregator;
  public isBusy: boolean;
  private toastrHelper: ToastrHelper;
  protected validationController : ValidationController;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController) {
    //Übernehmen der Parameter
    this.loc = loc;
    this.eventAggregator = eventAggregator;
    this.validationController = validationController;
    this.isBusy = false;

    //Erzeugen des Toastr-Helper
    this.toastrHelper = new ToastrHelper();

    //Festlegen des Validation-Renderer
    this.validationController.addRenderer(new BSInputFieldErrorRenderer());

    //Setzen des Validierungsmodus
    this.validationController.validateTrigger = validateTrigger.change;
  }

  //Muss von der Kind-Klasse überschrieben werden um spezifische
  //Aktionen während des Activate-Vorgangs von Aurelia durchzuführen
  //(Ist abstract und muss überschrieben werden)
  protected abstract async activateChild(info: any): Promise<void>

  //Zeigt ein Info-Toastr an
  protected showNotifyInfo(message: string): void {
    //Anzeigen des Toasts
    this.toastrHelper.showNotifyInfo(message);
  }

  //Zeigt ein Erfolgs-Toastr an
  protected showNotifySuccess(message: string): void {
    //Anzeigen des Toasts
    this.toastrHelper.showNotifySuccess(message);
  }

  //Zeigt ein Error-Toastr an
  protected showNotifyError(message: string): void {
    //Anzeigen des Toasts
    this.toastrHelper.showNotifyError(message);
  }

  //Zeigt ein Warning-Toastr an
  protected showNotifyWarning(message: string): void {
    //Anzeigen des Toasts
    this.toastrHelper.showNotifyWarning(message);
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

  //Sind aktuell Validierungsfehler vorhanden
  protected get hasValidationError(): boolean {
    return this.validationController.errors.length > 0;
  }
}

export abstract class ViewModelGeneralDialog extends ViewModelGeneral {
    //Members
    controller: DialogController;

    //C'tor
    constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogController: DialogController) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, validationController);

        //Übernehmen der restlichen Parameter
        this.controller = dialogController;
    }

    public async activate(info: any): Promise<void> {
        return this.activateChild(info);
    }
}

export abstract class ViewModelGeneralView extends ViewModelGeneral {
  //Members
  dialogService: DialogService;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController,  dialogService: DialogService) {
    //Aufrufen des Constructors der Vater-Klasse
    super(loc, eventAggregator, validationController);

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

export abstract class GridViewModelStammdaten<T extends Entity> extends ViewModelGeneralView {
  //Member-Deklarationen
  protected router: AppRouter;
  protected routeForEdit: string;
  protected entities: Array<T>;
  protected isItemSelected: boolean;
  public isAddEnabled: boolean;
  public isEditEnabled: boolean;
  public isDeleteEnabled: boolean;
  public isRefreshEnabled: boolean;
  protected IDToSelect: number;
  protected selectedID: number;
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
  constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, routeForEdit: string, router: AppRouter) {
    //Aufrufen des Konstruktors für die Vater Klasse
    super(loc, eventAggregator, validationController, dialogService);

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

export abstract class GridViewModelStammdatenNormal<T extends Entity> extends GridViewModelStammdaten<T> {
  //Members
  service: ServiceModelStammdatenNormal<T>;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, routeForEdit: string, 
              router: AppRouter, service: ServiceModelStammdatenNormal<T>) {
    //Aufrufen des Konstruktors für die Vater Klasse
    super(loc, eventAggregator, validationController, dialogService, routeForEdit, router);

    //Übernehmen der Parameter
    this.service = service;
  }

  //Laden der Daten über den Service
  protected async load(info: any): Promise<void> {
    //Laden der Daten über Service anstoßen
    this.entities = await this.service.getData() as Array<T>;
  }
}

export abstract class GridViewModelStammdatenID<T extends Entity, F extends Entity> extends GridViewModelStammdaten<T> {
  //Members
  service: ServiceModelStammdatenID<T, F>;
  fatherItem: F;
  routeFather: string;
  isBackEnabled: boolean;

  //C'tor
  constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, 
              routeForEdit: string, routeForFather: string, router: AppRouter, service: ServiceModelStammdatenID<T, F>) {
    //Aufrufen des Konstruktors für die Vater Klasse
    super(loc, eventAggregator, validationController, dialogService, routeForEdit, router);

		//Übernehmen der Parameter
    this.service = service;
    this.routeFather = routeForFather;
	}

  //Laden der Daten über den Service
  protected async load(info: any): Promise<void> {
		//Laden der Daten über den Service anstoßen
    this.entities = await this.service.getData(Number(info.idFather));

    //Übernehemen des Vaters
    this.fatherItem = await this.service.getDataFather(Number(info.idFather));
	}
}

export abstract class ViewModelEdit<T extends Entity> extends ViewModelGeneralView {
    //Member-Deklarationen
    routeForList: string;
    router: AppRouter;
    itemToEdit: T;
    editMode: enViewModelEditMode;
    cancelAlertIdentifier: string

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, routeForList: string, 
                router: AppRouter) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(loc, eventAggregator, validationController, dialogService);

        //Übernehmen der Parameter
        this.routeForList = routeForList;
        this.router = router;
    }

    //Wird aufgerufen wenn der Aurelia-Router Aurelia die View anzeigen möchte.
    //Hier können asynchrone Vorgänge durchgeführt werden
    public async activate(info: any): Promise<void> {
        if (info.operation == "new") {
            //Setzen des Edit-Modes
            this.editMode = enViewModelEditMode.New;

            //Aufrufen der Methode zum Anlegen eines neuen Items
            if (info.idFather) {
                //Aufrufen der Methode zum Erzeugen eines neuen Elementes
                await this.createNew(info);

                //Aufrufen der Child-Routine
                return this.activateChild(info);
            }
            else {
                //Aufrufen der Methode zum Erzeugen eines neuen Elementes
                await this.createNew(info);

                //Aufrufen der Child-Routine
                return this.activateChild(info);
            }
        }
        else {
            //Setzen des Edit-Modes
            this.editMode = enViewModelEditMode.Edit;

            //Aufrufen der Lade-Methode und der Child-Methode
            if (info.idFather) {
                //Aufrufen der Methode zum Laden
                await this.load(info);
                   
                //Aufrufen der Child-Methode
                return this.activateChild(info);
            }
            else {
                //Aufrufen der Methode zum Laden
                await this.load(info);

                //Aufrufen der Child-Methode
                return this.activateChild(info);
            }
        }
    }

    //Laden der Daten über den Service (Ist abstract und muss überschrieben werden)
    protected abstract async load(info: any): Promise<T>;

    //Ein neues Item erzeugen (Ist abstract und muss überschrieben werden
    protected abstract async createNew(info: any): Promise<T>;
 
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
                    width: 600,
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: this.loc.tr('Leave_Page.Question.Confirm_Button', { ns: 'Alerts' }),
                    cancelButtonText: this.loc.tr('Leave_Page.Question.Cancel_Button', { ns: 'Alerts' }),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }
              );

            //Benachrichtigung ausgeben
            this.showNotifyInfo(this.loc.tr(this.cancelAlertIdentifier, { ns: 'Toasts', context: this.editMode }));

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

    //Muss von der Kind-Klasse überschrieben werden um
    //die Aktionen zum Speichern der Daten auszuführen
    //(Ist abstract und muss überschrieben werden)
    protected abstract async saveChanges(): Promise<void>;
}

export abstract class ViewModelEditNormal<T extends Entity> extends ViewModelEdit<T> {
    //Members
    service: ServiceModelStammdatenEditNormal<T>;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, routeForList: string, 
                router: AppRouter, service: ServiceModelStammdatenEditNormal<T>) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(loc, eventAggregator, validationController, dialogService, routeForList, router);

        //Übernehmen der Parameter
        this.service = service;
    }

    //Liefert zurück ob der Service aktuell ausstehende Änderungen hat
    protected hasChanges(): boolean {
        return this.itemToEdit.isDirty() || this.itemToEdit.isNew();
    }

    //Laden der Daten über den Service
    protected async load(info: any): Promise<T> {
        //Über Promise das Laden des zu editierenden Items anstoßen
        this.itemToEdit = await this.service.getItem(Number(info.id)) as T;

        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }

    //Erstellt ein neues Item
    protected async createNew(info: any): Promise<T> {
        //Übernehmen der Entity
        this.itemToEdit = this.service.createNew() as T;

        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }
}

export abstract class ViewModelEditID<T extends Entity, F extends Entity> extends ViewModelEdit<T> {
    //Members
    service: ServiceModelStammdatenEditID<T, F>;
    fatherItem: F;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, 
                routeForList: string, router: AppRouter, service: ServiceModelStammdatenEditID<T, F>) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(loc, eventAggregator, validationController, dialogService, routeForList, router);

        //Übernehmen der Parameter
        this.service = service;
    }

    //Liefert zurück ob der Service aktuell ausstehende Änderungen hat
    protected hasChanges(): boolean {
        return this.itemToEdit.isDirty() || this.itemToEdit.isNew();
    }

    //Laden der Daten über den Service
    protected async load(info: any): Promise<T> {
        //Laden des Items
        this.itemToEdit = await this.service.getItem(Number(info.id));

        //Laden des Vaters
        this.fatherItem = await this.service.getFather(Number(info.idFather));

        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }

    //Erstellt ein neues Item
    protected async createNew(info: any): Promise<T> {
        //Erzeugen einer neuen Entity
        this.itemToEdit = this.service.createNew(Number(info.idFather)) as T;

        //Ermitteln der Daten des Vaters
        this.fatherItem = await this.service.getFather(Number(info.idFather)) as F;
        
        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }
}

export abstract class ViewModelGeneralDataDelete<T extends Entity> extends ViewModelGeneralView {
    //Members
    router: AppRouter;
    entities: Array<T>;
    service: ServiceModelLoadDataDelete<T>;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, 
                router: AppRouter, service: ServiceModelLoadDataDelete<T>) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(loc, eventAggregator, validationController, dialogService);

        //Übernehmen der Parameter
        this.service = service;
        this.router = router;
    }

    //Wird aufgerufen wenn der Aurelia-Router Aurelia die View anzeigen möchte.
    //Hier können asynchrone Vorgänge durchgeführt werden
    public async activate(info: any): Promise<void> {
        //Aufrufen der Lade-Methode
        await this.load(info);

        //Aufrufen der Child-Methode
        return this.activateChild(info);
    }

    //Laden der Daten über den Service
    protected async load(info: any): Promise<void> {
        //Aufrufen der Lade-Methode im Service
        //und übernehmen der Entitites
        this.entities = await this.service.getData() as Array<T>;
    }
}

export abstract class AssignViewModelStammdaten<T extends Entity, F extends Entity> extends ViewModelGeneralView {
    //Member-Deklarationen
    routeForEdit: string;
    router: AppRouter;
    selectedFatherItem: F;
    entities: Array<T>;
    service: ServiceModelAssign<T>;

    isChooseAlbumEnabled: boolean;
    isAddEnabled: boolean;
    isRefreshEnabled: boolean;
    isChangeSortEnabled: boolean;

    //C'tor
    constructor (loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, router: AppRouter, 
                 service: ServiceModelAssign<T>, routeForEdit: string) {
        //Aufrufen des Konstruktors für die Vater-Klasse
        super(loc, eventAggregator, validationController, dialogService);

        //Übernehmen der restlichen Parameter
        this.router = router;
        this.service = service;
        this.routeForEdit = routeForEdit;

        //Setzen der Standard-Werte für die Properties
        this.isChooseAlbumEnabled = true;
        this.isAddEnabled = false;
        this.isRefreshEnabled = false;
        this.isChangeSortEnabled = false;
    }

    //Wird aufgerufen wenn der Aurelia-Router die View anzeigen möchte.
    //Hier können asynchrone Vorgänge durchgeführt werden. Daher ist der Return-Value
    //dieser Methode entweder ein Promise oder null
    public async activate(info: any): Promise<void> {
        //Aufrufen der Kind-Methode
        return this.activateChild(info);
    }

    //Wird von Vaterklasse überschrieben
    protected checkEnabledState(): void {
        if (this.isBusy) {
          this.isAddEnabled = false;
          this.isChangeSortEnabled = false;
          this.isChooseAlbumEnabled = false;
          this.isRefreshEnabled = false;
        }
        else {
          //Aktivieren der Items die immer aktiv sind
          this.isChooseAlbumEnabled = true;

          if (this.selectedFatherItem != null) {
            //Wenn ein Vater-Item (Album) ausgewählt wurde,
            //dann können auch die Buttons aktiviert werden
            this.isAddEnabled = true;
            this.isRefreshEnabled = true;
            this.isChangeSortEnabled = true;
          }
          else {
            //Wenn kein Vater-Item (Album) ausgewählt wurde,
            //dann müssen auch die Buttons deaktiviert werden
            this.isAddEnabled = false;
            this.isRefreshEnabled = false;
            this.isChangeSortEnabled = false;
          }
        }
    }
}

export abstract class ViewModelAssignEdit<T extends Entity, F extends Entity> extends ViewModelEdit<T> {
    //Members
    service: ServiceModelAssignEdit<T>;
    fatherItem: F;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, 
                routeForList: string, router: AppRouter, service: ServiceModelAssignEdit<T>) {
        //Aufrufen des Konstruktors für die Vater Klasse
        super(loc, eventAggregator, validationController, dialogService, routeForList, router);

        //Übernehmen der Parameter
        this.service = service;
    }

    //Liefert zurück ob der Service aktuell ausstehende Änderungen hat
    protected hasChanges(): boolean {
        return this.itemToEdit.isDirty() || this.itemToEdit.isNew();
    }

    //Laden der Daten über den Service
    protected async load(info: any): Promise<T> {
        //Über Promise das Laden des zu editierenden Items anstoßen
        var ResultSet: EditDataWithFatherModel = await this.service.getItem(Number(info.id));

        //Übernehmen der Entity
        this.itemToEdit = ResultSet.editItem as T;
        this.fatherItem = ResultSet.fatherItem as F;

        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }

    //Erstellt ein neues Item
    protected async createNew(info: any): Promise<T> {
        //Erzeugen einer neuen Entity
        this.itemToEdit = this.service.createNew(Number(info.idFather)) as T;

        //Ermitteln der Daten des Vaters
        this.fatherItem = await this.service.getFather(Number(info.idFather)) as F;
        
        //Promise zurückmelden
        return Promise.resolve(this.itemToEdit);
    }
}
