import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { FacetValue } from '../../../Models/Entities/FacetValue';
import {CategoryValueServiceEdit} from './categoryvalue-service';
import {ViewModelEditID} from '../../../Helper/ViewModelHelper';
import {AppRouter} from 'aurelia-router';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {ValidationErrorsChangedEventArgs, Validator, ValidationError} from 'breeze-client';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import swal from 'sweetalert2';
import {enViewModelEditMode} from '../../../Enum/FamilieLaissEnum';
import { ValidationController } from 'aurelia-validation';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), DialogService, AppRouter, CategoryValueServiceEdit)
export class CategoryValueEdit extends ViewModelEditID<FacetValue, FacetGroup> {
    //Konfiguration für i18N
    locConfig = { ns: ['StammCategoryValue', 'translation'] };

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, validationController: ValidationController, dialog: DialogService, 
                router: AppRouter, service: CategoryValueServiceEdit) {
        //Aufrufen des Vater Constructors
        super(localize, aggregator, validationController, dialog, "categoryvalue", router, service);

        //Setzen des Identifiers für das Cancel-Alert
        this.cancelAlertIdentifier = 'CategoryValue.Cancel.Success';
    }

    //Überprüft den Enabled State
    protected checkEnabledState(): void {
    }

    //Wird aufgerufen wenn auf den Save-Button geklickt wird
    public async saveChanges(): Promise<void> {
        //Einblenden der Busy-Box
        this.setBusyState(true);

        try {
          //Vor dem Speichern noch mal eine Validierung starten
          await this.validationController.validate();

          //Wenn keine Validierungsfehler anstehen, dann wird gespeichert
          if (!this.hasValidationError) {
             //Aufrufen der Speicherroutine
             await this.itemToEdit.save();

             //Ausblenden der Busy-Box
             this.setBusyState(false);

             //Ausgeben einer Erfolgsmeldung
             this.showNotifySuccess(this.loc.tr('CategoryValue.Save.Success', { ns: 'Toasts' }));

             //Zurück zur Liste der Kategorien springen
             this.router.navigate(this.routeForList + "/" + this.fatherItem.ID + "/" + this.itemToEdit.ID);
          }
        }
        catch (ex) {
          //Ausblenden der Busy-Box
          this.setBusyState(false);
 
          //Überprüfen ob Validierungsfehler anstehen. Wenn ja liegt das
          //fehlerhafte Speichern an den Validierungsfehlern und es muss nichts
          //weiter gemacht werden.
          //Wenn nicht muss eine entsprechende Fehlermeldung angezeigt werden,
          //dass das Speichern nicht funktioniert hat
          if (!this.hasValidationError) {
            this.showNotifyError(this.loc.tr('CategoryValue.Save.Error', { ns: 'Toasts' }));
          }
        }
    }

    //Wird aufgerufen wenn auf den Cancel-Button geklickt wird
    public cancelChanges(): void {
          if (this.editMode == enViewModelEditMode.Edit) {
            this.router.navigate(this.routeForList + "/" + this.fatherItem.ID + "/" + this.itemToEdit.ID);
          }
          else {
            this.router.navigate(this.routeForList + "/" + this.fatherItem.ID);
          }
    }

    //Wird hier nicht benötigt
    protected attachedChild(): void {
      
    }
    
    //Wird hier nicht benötigt
    protected attachedChildTimeOut() : void 
    {
    }

    //Wird hier nicht benötigt
    protected async activateChild(info: any): Promise<void> {
      return Promise.resolve();
    }

    //Wird hier nicht benötigt
    protected busyStateChanged(): void {

    }
}
