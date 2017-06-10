import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { ViewModelEditNormal} from '../../../Helper/ViewModelHelper';
import { CategoryServiceEdit } from './category-service';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import {autoinject} from 'aurelia-dependency-injection';
import swal from 'sweetalert2';
import {enViewModelEditMode} from '../../../Enum/FamilieLaissEnum';

@autoinject()
export class CategoryEdit extends ViewModelEditNormal<FacetGroup> {
    //Objekt für i18n Namespace-Definition
    locConfig: any = { ns: ['StammCategory', 'translation'] };

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, router: AppRouter, service: CategoryServiceEdit) {
        //Aufrufen des Vaters
        super(localize, aggregator, dialog, "category", router, service);
    }

    //Überprüft den Enabled State
    protected checkEnabledState(): void {
        if (this.isBusy) {
            this.isSavingEnabled = false;
        }
        else {
            if (this.itemToEdit.entityAspect.hasValidationErrors) {
                this.isSavingEnabled = false;
            }
            else {
                this.isSavingEnabled = true;
            }
        }
    }

    //Wird aufgerufen wenn auf den Save-Button geklickt wird
    public async saveChanges(): Promise<void> {
        //Einblenden der Busy-Box
        this.setBusyState(true);

        try {
          //Aufrufen der Speicherroutine
          await this.service.saveChanges();

          //Ausblenden der Busy-Box
          this.setBusyState(false);

          //Ausgeben einer Erfolgsmeldung
          this.showNotifySuccess(this.loc.tr('Category.Save.Success', { ns: 'Toasts' }));

          //Die Event-Handler deregistrieren
          this.unsubscribeEvents();

          //Zurück zur Liste der Kategorien springen
          this.router.navigate(this.routeForList + "/" + this.itemToEdit.ID);
        }
        catch (ex) {
          //Ausblenden der Busy-Box
          this.setBusyState(false);
 
          //Überprüfen ob Validierungsfehler anstehen. Wenn ja liegt das
          //fehlerhafte Speichern an den Validierungsfehlern und es muss nichts
          //weiter gemacht werden.
          //Wenn nicht muss eine entsprechende Fehlermeldung angezeigt werden,
          //dass das Speichern nicht funktioniert hat
          if (!this.itemToEdit.entityAspect.hasValidationErrors) {
            this.showNotifyError(this.loc.tr('Category.Save.Error', { ns: 'Toasts' }));
          }
        }
    }

    //Führt den tatsächlichen Cancel aus
    private cancelChangesExecute(): void {
        //Verwerfen der Änderungen
        this.service.rejectChanges();
                
        //Benachrichtigung ausgeben
        this.showNotifyInfo(this.loc.tr('Category.Cancel.Success', { ns: 'Toasts', context: this.editMode }));

        //Die Event-Handler deregistrieren
        this.unsubscribeEvents();

        //Zurückkehren zur Liste der Kategorien
        if (this.editMode == enViewModelEditMode.Edit) {
            this.router.navigate(this.routeForList + "/" + this.itemToEdit.ID);
        }
        else {
            this.router.navigate(this.routeForList);
        }
    }

    //Wird aufgerufen wenn auf den Cancel-Button geklickt wird
    public async cancelChanges(): Promise<void> {
        //Nur wenn sich auch etwas geändert hat oder es sich um einen neuen Eintrag handelt, dann wird auch eine
        //Sicherheitsabfrage ausgegeben
        if (this.editMode == enViewModelEditMode.New || (this.editMode == enViewModelEditMode.Edit && this.hasChanges())) {
            //Anzeigen einer Sicherheitsabfrage ob wirklich abgebrochen werden soll
            try {
              await swal(
                {
                    titleText: this.loc.tr('Cancel_Edit.Question.Header', { ns: 'Alerts' }),
                    text: this.loc.tr('Cancel_Edit.Question.Body', { ns: 'Alerts' }),
                    type: 'warning',
                    width: 600,
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: this.loc.tr('Cancel_Edit.Question.Confirm_Button', { ns: 'Alerts' }),
                    cancelButtonText: this.loc.tr('Cancel_Edit.Question.Cancel_Button', { ns: 'Alerts' }),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }
              );

              //Ausführen der eigentlichen Cancel-Prozedur
              this.cancelChangesExecute();
            }
            catch(ex) {
            }
        }
        else {
            //Ausführen der eigentlichen Cancel-Prozedur
            this.cancelChangesExecute();
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
