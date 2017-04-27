import { SortCriteria } from './../../../Models/SortCriteria';
import {ViewModelGeneralDataDelete} from '../../../Helper/ViewModelHelper';
import {I18N} from 'aurelia-i18n';
import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {AppRouter} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';
import {enSortDirection} from '../../../Enum/FamilieLaissEnum';
import {UploadInProgressEvent} from '../../../Events/UploadControlEvents';
import {DeletePictureEvent} from '../../../Events/PictureEvents';
import {PictureUploadService} from './picture-upload-service';
import swal from 'sweetalert2';

@autoinject()
export class PictureUploadList extends ViewModelGeneralDataDelete {
    //Config für i18N
    locConfig: any = { ns: 'StammPictureUpload' };
  
    //Member für die Sortierkriterien
    sortCriteriaList: Array<SortCriteria> = [];
    sortCriteriaHeaderText: string;
    currentSortCriteria: SortCriteria;

    //Member für den Upload
    uploadInProgress: boolean;

    //Event-Aggregator 
    subscribeProgressEvent: Subscription;
    subscribeDeleteEvent: Subscription;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, dialogService: DialogService, router: AppRouter, service: PictureUploadService) {
        //Aufrufen der Vater-Klasse
        super(loc, eventAggregator, dialogService, router, service);

        //Befüllen der Liste der Sortkriterien
        var SortCriteriaAdd: SortCriteria;

        SortCriteriaAdd = new SortCriteria();
        SortCriteriaAdd.propertyName = 'NameOriginal';
        SortCriteriaAdd.localizeName = 'Name';
        SortCriteriaAdd.direction = enSortDirection.Ascending;
        SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.NameAscending', { ns: 'StammPictureUpload'});
        this.sortCriteriaList.push(SortCriteriaAdd);

        SortCriteriaAdd = new SortCriteria();
        SortCriteriaAdd.propertyName = 'NameOriginal';
        SortCriteriaAdd.localizeName = 'Name';
        SortCriteriaAdd.direction = enSortDirection.Descending;
        SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.NameDescending', { ns: 'StammPictureUpload'})
        this.sortCriteriaList.push(SortCriteriaAdd);

        SortCriteriaAdd = new SortCriteria();
        SortCriteriaAdd.propertyName = 'UploadDate';
        SortCriteriaAdd.localizeName = 'UploadDate';
        SortCriteriaAdd.direction = enSortDirection.Ascending;
        SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.UploadDateAscending', { ns: 'StammPictureUpload'})
        this.sortCriteriaList.push(SortCriteriaAdd);

        SortCriteriaAdd = new SortCriteria();
        SortCriteriaAdd.propertyName = 'UploadDate';
        SortCriteriaAdd.localizeName = 'UploadDate';
        SortCriteriaAdd.direction = enSortDirection.Descending;
        SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.UploadDateDescending', { ns: 'StammPictureUpload'})
        this.sortCriteriaList.push(SortCriteriaAdd);

        //Start-Sortierung nach dem ersten Sortierkriterium
        this.sortBy(this.sortCriteriaList[0]);

        //Registrieren für das "Upload in Progress" Event
        this.subscribeProgressEvent = this.eventAggregator.subscribe(UploadInProgressEvent, 
          (message: UploadInProgressEvent) => {
            //Übernehmen des Status
            this.uploadInProgress = message.isInProgress;
        });

        //Registrieren für das "Delete-Picture-Event"
        this.subscribeDeleteEvent = this.eventAggregator.subscribe(DeletePictureEvent, 
          (message: DeletePictureEvent) => {
            //Aufrufen der Methode zum Löschen des Bildes
            this.deletePicture(message.item);
        });
    }

    //Wird aufgerufen wenn der Anwender im Dropdown den entsprechenden
    //Sortiereintrag ausgewählt hat
    private sortBy(sortCriteria: SortCriteria): void {
        //Setzen des aktuellen Sortierkriteriums
        this.currentSortCriteria = sortCriteria;

        //Ermitteln des Textes für den Header
        this.sortCriteriaHeaderText =
            this.loc.tr('Card.Header.SortCriteriaHeader.Header',
                { ns: 'StammPictureUpload', context: sortCriteria.localizeName + '_' + sortCriteria.direction });
    }
  
    //Wird aufgerufen wenn der Anwender auf den Refresh-Button klickt
    public async refreshList(): Promise<void> {
        //Einblenden der Busy-Box
        this.setBusyState(true);

        //Laden der Bilder über ein Promise
        this.entities = await this.service.getData();

        //Ausblenden der Busy-Box
        this.setBusyState(false);
    }

    //Löscht ein Upload-Picture. Wird über das Event vom Aggregator aufgerufen
    private async deletePicture(itemToDelete: any): Promise<void> {
      try {
        //Ausgeben einer Sicherheitsabfrage
        await swal({
          title: this.loc.tr('Delete.UploadPicture.Header', { ns: 'Alerts' }),
          text: this.loc.tr('Delete.UploadPicture.Body', { ns: 'Alerts', 'name': itemToDelete.Name_Original }),
          type: "warning",
          width: 600,
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: this.loc.tr('Delete.UploadPicture.Confirm_Button', { ns: 'Alerts' }),
          cancelButtonText: this.loc.tr('Delete.UploadPicture.Cancel_Button', { ns: 'Alerts' }),
          allowOutsideClick: false,
          allowEscapeKey: false});

          //Einblenden der Busy-Box
          this.setBusyState(true);
          
          try {
            //Löschen des Items auf dem Server
            await this.service.deleteItem(itemToDelete.ID);

            //Ermitteln des Index des Items
            var Index = this.entities.indexOf(itemToDelete);

            //Entfernen des Elements aus dem Array
            this.entities.splice(Index, 1);

            //Ausblenden der Busy-Box
            this.setBusyState(false);
                       
            //Ausgeben einer Erfolgsmeldung
            this.showNotifySuccess(this.loc.tr('PictureUpload.Delete.Success', { ns: 'Toasts' }));
          }
          catch (ex) {
            //Ausblenden der Busy-Box
            this.setBusyState(false);

            //Zurücknehmen der Änderungen (Delete-State)
            this.service.rejectChanges();

            //Ausgeben einer Fehlermeldung
            this.showNotifyError(this.loc.tr('PictureUpload.Delete.Error', { ns: 'Toasts' }));
          }
      }
      catch (ex) {
        //Wenn auf den Abbrechen-Button geklickt wird muss nichts gemacht werden
      }
    }

    //Wird von Aurelia aufgerufen
    protected attachedChild(): void {
    }

    //Wird von Aurelia zeitverzögert aufgerufen wenn die View zum DOM hinzugefügt wird
    protected attachedChildTimeOut() : void {
    }

    //Wird von der Vater-Klasse aufgerufen wenn die View vom Router
    //aktiviert wird aber noch nicht angezeigt. 
    protected async activateChild(info: any): Promise<void> {
    }
    
    //Wird von Aurelia aufgerufen ob die View verlassen werden kann
    public async canDeactivate(): Promise<boolean> {
        //Wenn ein Upload aktiv ist, dann darf die View nicht verlassen werden
        if (this.uploadInProgress) {
          try {
            //Meldungsfenster anzeigen
            await swal({
              title: this.loc.tr('Upload.Picture.LeavePage.Header', { ns: 'Alerts' }),
              text: this.loc.tr('Upload.Picture.LeavePage.Body', { ns: 'Alerts' }),
              type: "info",
              width: 600,
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: this.loc.tr('Upload.Picture.LeavePage.Confirm_Button', { ns: 'Alerts' }),
              allowOutsideClick: false,
              allowEscapeKey: false});

            //Promise zurückliefern
            return Promise.resolve(true)  
          }
          catch(ex) {
            return Promise.reject(false);
          }
        }
        else {
          //Promise zurückliefern
          return Promise.resolve(true);
        }
    }

    //Wird von Aurelia aufgerufen
    public deactivate(): void {
        //Deregistrieren beim Event-Aggregator
        this.subscribeProgressEvent.dispose();
        this.subscribeDeleteEvent.dispose();
    }

    //Wird durch Framework automatisch aufgerufen wenn der Enabled-State der Buttons 
    //neu überprüft werden muss
    protected checkEnabledState(): void {
    }

    //Wird vom Framework aufgerufen wenn sich der isBusy-Status geändert hat
    protected busyStateChanged(): void {

    }
        
    //Wird vom Tab-Control aufgerufen wenn es erstellt wurde
    public tabCreated() {

    }

    //Wird vom Tab-Control aufgerufen bevor eine Tabseite aktiviert ist
    public tabBeforeActive() {

    }

    //Wird vom Tab-Control aufgerufen nach dem eine Tabseite aktiviert wurde
    public tabAfterActive() {

    }
}
