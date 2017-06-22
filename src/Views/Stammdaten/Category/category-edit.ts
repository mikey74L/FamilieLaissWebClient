import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { ViewModelEditNormal} from '../../../Helper/ViewModelHelper';
import { CategoryServiceEdit } from './category-service';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import { ValidationController } from 'aurelia-validation';
import swal from 'sweetalert2';
import {enViewModelEditMode} from '../../../Enum/FamilieLaissEnum';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), DialogService, AppRouter, CategoryServiceEdit)
export class CategoryEdit extends ViewModelEditNormal<FacetGroup> {
    //Objekt für i18n Namespace-Definition
    locConfig: any = { ns: ['StammCategory', 'translation'] };

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, validationController: ValidationController, 
                dialog: DialogService, router: AppRouter, service: CategoryServiceEdit) {
        //Aufrufen des Vaters
        super(localize, aggregator, validationController, dialog, "category", router, service);

        //Setzen des Identifiers für das Cancel-Alert
        this.cancelAlertIdentifier = 'Category.Cancel.Success';
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
             this.showNotifySuccess(this.loc.tr('Category.Save.Success', { ns: 'Toasts' }));

             //Zurück zur Liste der Kategorien springen
             this.router.navigate(this.routeForList + "/" + this.itemToEdit.ID);
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
            this.showNotifyError(this.loc.tr('Category.Save.Error', { ns: 'Toasts' }));
          }
        }
    }

    //Wird aufgerufen wenn auf den Cancel-Button geklickt wird
    public cancelChanges(): void {
       if (this.editMode == enViewModelEditMode.Edit) {
         this.router.navigate(this.routeForList + "/" + this.itemToEdit.ID);
       }
       else {
         this.router.navigate(this.routeForList);
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
