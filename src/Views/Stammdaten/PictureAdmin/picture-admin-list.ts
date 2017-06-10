import { MediaItem } from './../../../Models/Entities/MediaItem';
import { MediaGroup } from './../../../Models/Entities/MediaGroup';
import { AssignViewModelStammdaten } from '../../../Helper/ViewModelHelper';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import { SortCriteria } from './../../../Models/SortCriteria';
import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {DialogService, DialogCloseResult} from 'aurelia-dialog';
import {ChooseAlbumDialog } from '../../../CustomDialogs/ChooseAlbumDialog';
import {AppRouter} from 'aurelia-router';
import {enSortDirection} from '../../../Enum/FamilieLaissEnum';
import {DeletePictureEvent, EditPictureEvent} from '../../../Events/PictureEvents';
import {PictureAdminService} from './picture-admin-service';
import swal from 'sweetalert2';

@autoinject()
export class PictureAdminList extends AssignViewModelStammdaten<MediaItem, MediaGroup> {
  //Konfiguration für i18N
  locConfig: any = { ns: ['StammPictureAdmin', 'translation']};
 
  //Members für die Liste
  sortCriteriaHeaderText: string;
  currentSortCriteria: SortCriteria;
  sortCriteriaList: Array<SortCriteria> = [];

  //Members
  albumChoosed: boolean;
  albumContext: string;
  albumList: Array<MediaGroup> = [];

  subscribeDeleteEvent: Subscription;
  subscribeEditEvent: Subscription;

  //C'tor
  constructor (loc: I18N, eventAggregator: EventAggregator, dialogService: DialogService, router: AppRouter, 
               service: PictureAdminService) {
    //Aufrufen des Konstruktors der Vater-Klasse
    super (loc, eventAggregator, dialogService, router, service, 'pictureadminedit');

    //Setzen des Textes für das Auswählen eines Albums
    this.albumChoosed = false;
    this.albumContext = 'notchoosed';
    this.sortCriteriaHeaderText = this.loc.tr('AdminList.ChooseAlbum', this.locConfig);

    //Befüllen der Liste der Sortkriterien
    var SortCriteriaAdd: SortCriteria;

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.NameOriginal';
    SortCriteriaAdd.localizeName = 'Name';
    SortCriteriaAdd.direction = enSortDirection.Ascending;
    SortCriteriaAdd.displayText = this.loc.tr('AdminList.Card.Header.SortMenuItems.NameAscending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.NameOriginal';
    SortCriteriaAdd.localizeName = 'Name';
    SortCriteriaAdd.direction = enSortDirection.Descending;
    SortCriteriaAdd.displayText = this.loc.tr('AdminList.Card.Header.SortMenuItems.NameDescending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'CreateDate';
    SortCriteriaAdd.localizeName = 'AssignDate';
    SortCriteriaAdd.direction = enSortDirection.Ascending;
    SortCriteriaAdd.displayText = this.loc.tr('AdminList.Card.Header.SortMenuItems.AssignDateAscending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'CreateDate';
    SortCriteriaAdd.localizeName = 'AssignDate';
    SortCriteriaAdd.direction = enSortDirection.Descending;
    SortCriteriaAdd.displayText = this.loc.tr('AdminList.Card.Header.SortMenuItems.AssignDateDescending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.UploadDate';
    SortCriteriaAdd.localizeName = 'UploadDate';
    SortCriteriaAdd.direction = enSortDirection.Ascending;
    SortCriteriaAdd.displayText = this.loc.tr('AdminList.Card.Header.SortMenuItems.UploadDateAscending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.UploadDate';
    SortCriteriaAdd.localizeName = 'UploadDate';
    SortCriteriaAdd.direction = enSortDirection.Descending;
    SortCriteriaAdd.displayText = this.loc.tr('AdminList.Card.Header.SortMenuItems.UploadDateDescending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    //Initialisieren 
    this.entities = [];

    //Registrieren für das "Delete-Picture-Event"
    this.subscribeDeleteEvent = this.eventAggregator.subscribe(DeletePictureEvent, 
      (message: DeletePictureEvent) => {
        //Aufrufen der Methode zum Löschen des Bildes
        this.deletePicture(message.item);
    });

    //Registrieren für das "Edit-Picture-Event"
    this.subscribeEditEvent = this.eventAggregator.subscribe(EditPictureEvent, 
      (message: EditPictureEvent) => {
        //Aufrufen der Methode zum Editieren des Bildes
        this.editPicture(message.item);
    });
  }

  //Wird von Aurelia aufgerufen
  public deactivate(): void {
    //Deregistrieren beim Event-Aggregator
    this.subscribeEditEvent.dispose();
    this.subscribeDeleteEvent.dispose();
  }

  //Wird von der Vater-Klasse aufgerufen wenn die View vom Router
  //aktiviert wird aber noch nicht angezeigt. 
  protected async activateChild(info: any): Promise<void> {
    //Laden der Alben beim Aufruf der View
    this.albumList = await this.service.loadAlben() as Array<MediaGroup>;

    //Wenn eine ID für ein Album übergeben wurde,
    //dann wird das Album ausgewählt. Dieses ist dann der Fall
    //wenn vor der Edit-View zurückgesprungen wird.
    if (info.idFather != null) {
      //Leeren des Arrays für die bisherigen Einträge
      this.entities = [];

      //Ermitteln des Albums anhand der ID
      for (var Item of this.albumList) {
        if (Item.ID == info.idFather) {
          this.selectedFatherItem = Item;
          this.albumContext = 'choosed';
          this.albumChoosed = true;
          break;
        }
      }

      //Setzen des Busy-States
      this.setBusyState(true);

      //Laden der neuen Daten mit einem Promise
      this.entities = await this.service.getData(this.selectedFatherItem.ID) as Array<MediaItem>;

      //Zurücksetzen des Busy-State
      this.setBusyState(false);

      //Start-Sortierung nach dem ersten Sortierkriterium
      this.sortBy(this.sortCriteriaList[0]);
    }
  }

  //Wird von Aurelia aufgerufen
  protected attachedChild(): void {
  }

  //Wird vom Framework aufgerufen wenn sich der isBusy-Status geändert hat
  protected busyStateChanged(): void {
  }

  //Wird aufgerufen wenn der Anwender im Dropdown den entsprechenden
  //Sortiereintrag ausgewählt hat
  private sortBy(sortCriteria: SortCriteria): void {
    //Setzen des aktuellen Sortierkriteriums
    this.currentSortCriteria = sortCriteria;

    //Ermitteln des Textes für den Header
    this.sortCriteriaHeaderText =
      this.loc.tr('AdminList.Card.Header.SortCriteriaHeader.Header',
        { ns: 'StammPictureAdmin', context: sortCriteria.localizeName + '_' + sortCriteria.direction });
  }

  //Wird aufgerufen wenn auf den Button zur Auswahl eines Albums gedrückt wird
  public async chooseAlbum(): Promise<void> {
     try { 
       //Anzeigen des Dialoges zur Auswahl eines Albums
       var Result: DialogCloseResult = await this.dialogService.open({viewModel: ChooseAlbumDialog, model: this.service})
                                                               .whenClosed((reason: DialogCloseResult) => { return reason;});

       //Übernehmen des ausgewählten Albums
       this.selectedFatherItem = Result.output;
       this.albumContext = 'choosed';
       this.albumChoosed = true;

       //Leeren des Arrays für die bisherigen Picture-Einträge
       this.entities = [];

       //Anzeigen der Busy-Box
       this.setBusyState(true);

       //Laden der neuen Daten
       this.entities = await this.service.getData(this.selectedFatherItem.ID) as Array<MediaItem>;

       //Startsortierung nach dem ersten Sortierkriterium
       this.sortBy(this.sortCriteriaList[0]);

       //Busy-Box ausblenden
       this.setBusyState(false);
     }
     catch (ex) {
       //Dialog wurde abgebrochen. Es muss nichts gemacht werden
     }
  }

  //Wird aufgerufen wenn der Button zum Hinzufügen eines Bildes gedrückt wird
  public addPicture(): void {
    //Es muss zur Seite zum Hinzufügen eines neuen Photos gesprungen werden
    this.router.navigate(this.routeForEdit + "/new/" + this.selectedFatherItem.ID + "/0");
  }
  
  //Wird über den Event-Agg aufgerufen wenn im Picture-Control auf den 
  //Delete-Button gedrückt wird
  private async deletePicture(itemToDelete: MediaItem): Promise<void> {
    try {
      //Ausgeben einer Sicherheitsabfrage
      await swal({
              titleText: this.loc.tr('Delete.AdminPicture.Header', { ns: 'Alerts' }),
              text: this.loc.tr('Delete.AdminPicture.Body', { ns: 'Alerts', 'namePicture': itemToDelete.UploadPicture.NameOriginal, 'nameAlbum': this.selectedFatherItem.NameGerman}),
              type: 'warning',
              width: 600,
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: this.loc.tr('Delete.AdminPicture.Confirm_Button', { ns: 'Alerts' }),
              cancelButtonText: this.loc.tr('Delete.AdminPicture.Cancel_Button', { ns: 'Alerts' }),
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            
      //Einblenden der Busy-Box
      this.setBusyState(true);

      try {
        //Deklaration
        var NamePicture: string;
        var NameAlbum: string;

        //Zwischenspeichern der Namen
        NamePicture = itemToDelete.UploadPicture.NameOriginal;
        NameAlbum = this.selectedFatherItem.NameGerman;

        //Wenn wirklich gelöscht werden soll, dann wird der Eintrag gelöscht
        await this.service.deleteItem(itemToDelete.ID);

        //Ermitteln des Index des Items
        var Index = this.entities.indexOf(itemToDelete);

        //Entfernen des Elements aus dem Array
        this.entities.splice(Index, 1);

        //Ausblenden der Busy-Box
        this.setBusyState(false);

        //Ausgeben einer Erfolgsmeldung
        this.showNotifySuccess(this.loc.tr('PictureAdmin.Delete.Success', { ns: 'Toasts', 'namePicture': NamePicture, 'nameAlbum': NameAlbum }));
      }
      catch (ex) {
        //Ausblenden der Busy-Box
        this.setBusyState(false);

        //Zurücknehmen der Änderungen (Delete-State)
        this.service.rejectChanges();

        //Ausgeben einer Fehlermeldung
        this.showNotifyError(this.loc.tr('PictureAdmin.Delete.Error', { ns: 'Toasts', 'namePicture': NamePicture, 'nameAlbum': NameAlbum }));
      }
    }
    catch (ex) {
      //Die Sicherheitsfrage wurde mit nein beendet
    }
  }

  //Wird über den Event-Agg aufgerufen wenn im Picture-Control auf den
  //Edit-Button gedrückt wird
  private editPicture(itemToEdit: MediaItem): void {
    //Es muss zur Seite zum Hinzufügen eines neuen Photos gesprungen werden
    this.router.navigate(this.routeForEdit + "/edit/" + this.selectedFatherItem.ID + "/" + itemToEdit.ID);
  }

  //Wird aufgerufen wenn auf den Refresh-Button gedrückt wird
  public async refreshList(): Promise<void> {
    //Einblenden der Busy-Box
    this.setBusyState(true);

    //Laden der Bilder über ein Promise
    this.entities = await this.service.getData(this.selectedFatherItem.ID) as Array<MediaItem>;

    //Ausblenden der Busy-Box
    this.setBusyState(false);
  }
}
