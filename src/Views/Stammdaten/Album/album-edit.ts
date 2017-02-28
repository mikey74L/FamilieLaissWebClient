import { ViewModelEditNormal} from '../../../Helper/ViewModelHelper';
import { AlbumServiceEdit } from './album-service';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import {autoinject} from 'aurelia-dependency-injection';
import swal from 'sweetalert2';

@autoinject()
export class AlbumEdit extends ViewModelEditNormal {
    //Objekt für i18n Namespace-Definition
    locOptions: any = { ns: ['StammAlbum', 'translation'] };

    //Members
    labelTextName: string;
    labelTextDescription: string;

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, router: AppRouter, service: AlbumServiceEdit) {
        //Aufrufen des Vaters
        super(localize, aggregator, dialog, "album", router, service);

        //Setzen der Texte für die Label-Texte
        this.labelTextName = this.loc.tr('Media_Group.Name.DisplayName', { ns: 'Metadata' });
        this.labelTextDescription = this.loc.tr('Media_Group.Description.DisplayName', { ns: 'Metadata' });
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
          this.showNotifySuccess(this.loc.tr('Album.Save.Success', { ns: 'Toasts' }));

          //Die Event-Handler deregistrieren
          this.unsubscribeEvents();

          //Zurück zur Liste der Alben springen
          var MyEntity: any = this.itemToEdit;
          this.router.navigate(this.routeForList + "/" + MyEntity.ID);
        }
        catch (ex) {
          //Überprüfen ob Validierungsfehler anstehen. Wenn ja liegt das
          //fehlerhafte Speichern an den Validierungsfehlern und es muss nichts
          //weiter gemacht werden.
          //Wenn nicht muss eine entsprechende Fehlermeldung angezeigt werden,
          //dass das Speichern nicht funktioniert hat
          if (!this.itemToEdit.entityAspect.hasValidationErrors) {
            this.showNotifyError(this.loc.tr('Album.Save.Error', { ns: 'Toasts' }));
          }
        }
    }

    //Führt den tatsächlichen Cancel aus
    private cancelChangesExecute(): void {
        //Verwerfen der Änderungen
        this.service.rejectChanges();
                
        //Benachrichtigung ausgeben
        this.showNotifyInfo(this.loc.tr('Album.Cancel.Success', { ns: 'Toasts', context: this.editMode }));

        //Die Event-Handler deregistrieren
        this.unsubscribeEvents();

        //Zurückkehren zur Liste der Alben
        if (this.editMode == "edit") {
            var MyEntity: any = this.itemToEdit;
            this.router.navigate(this.routeForList + "/" + MyEntity.ID);
        }
        else {
            this.router.navigate(this.routeForList);
        }
    }

    //Wird aufgerufen wenn auf den Cancel-Button geklickt wird
    public async cancelChanges(): Promise<void> {
        //Nur wenn sich auch etwas geändert hat oder es sich um einen neuen Eintrag handelt, dann wird auch eine
        //Sicherheitsabfrage ausgegeben
        if (this.editMode == "new" || (this.editMode == "edit" && this.hasChanges())) {
            //Anzeigen einer Sicherheitsabfrage ob wirklich abgebrochen werden soll
            try {
              await swal(
                {
                    titleText: this.loc.tr('Cancel_Edit.Question.Header', { ns: 'Alerts' }),
                    text: this.loc.tr('Cancel_Edit.Question.Body', { ns: 'Alerts' }),
                    type: 'warning',
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
    protected async activateChild(info: any): Promise<void> {
      return Promise.resolve();
    }

    //Wird hier nicht benötigt
    protected busyStateChanged(): void {

    }
}
