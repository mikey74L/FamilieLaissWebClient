import { AssignViewModelStammdaten } from '../../../Helper/ViewModelHelper';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import { SortCriteria } from './../../../Models/SortCriteria';
import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {DialogService, DialogResult} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import {enSortDirection} from '../../../Enum/FamilieLaissEnum';
import {DeletePictureEvent, EditPictureEvent} from '../../../Events/PictureEvents';
import {PictureAdminService} from './picture-admin-service';

@autoinject()
export class PictureAdminList extends AssignViewModelStammdaten {
  //Konfiguration für i18N
  locConfig: any = { ns: ['StammPictureAdmin', 'translation']};
 
  //Members für die Liste
  sortCriteriaHeaderText: string;
  currentSortCriteria: SortCriteria;
  sortCriteriaList: Array<SortCriteria> = [];

  //Members
  albumChoosed: boolean;
  albumContext: string;
  albumList: Array<any> = [];

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
    this.albumList = await this.service.loadAlben();

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
      this.entities = await this.service.getData(this.selectedFatherItem.ID);

      //Zurücksetzen des Busy-State
      this.setBusyState(false);

      //Start-Sortierung nach dem ersten Sortierkriterium
      this.sortBy(this.sortCriteriaList[0]);
    }
  }

  //Wird von Aurelia aufgerufen
  protected attachedChild(): void {
  }

  //Wird von Aurelia zeitverzögert aufgerufen wenn die View zum DOM hinzugefügt wird
  protected attachedChildTimeOut() : void {
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
    //Deklaration
    var Result: DialogResult;
    
    //Anzeigen des Dialoges zur Auswahl eines Albums
    Result = await this.dialogService.open({viewModel: 'CustomDialogs/ChooseAlbumDialog', model: this.service});

    //Nur wenn ein Album ausgewählt wurde dann muss was gemacht werden
    if (!Result.wasCancelled) {
      //Übernehmen des ausgewählten Albums
      this.selectedFatherItem = Result.output;
      this.albumContext = 'choosed';
      this.albumChoosed = true;

      //Leeren des Arrays für die bisherigen Picture-Einträge
      this.entities = [];

      //Anzeigen der Busy-Box
      this.setBusyState(true);

      //Laden der neuen Daten
      this.entities = await this.service.getData(this.selectedFatherItem.ID);

      //Startsortierung nach dem ersten Sortierkriterium
      this.sortBy(this.sortCriteriaList[0]);

      //Busy-Box ausblenden
      this.setBusyState(false);
    }
  }

  //Wird aufgerufen wenn der Button zum Hinzufügen eines Bildes gedrückt wird
  public addPicture(): void {
    //Es muss zur Seite zum Hinzufügen eines neuen Photos gesprungen werden
    this.router.navigate(this.routeForEdit + "/new/" + this.selectedFatherItem.ID + "/0");
  }
  
  //Wird über den Event-Agg aufgerufen wenn im Picture-Control auf den 
  //Delete-Button gedrückt wird
  private deletePicture(itemToDelete: any): void {

  }

  //Wird über den Event-Agg aufgerufen wenn im Picture-Control auf den
  //Edit-Button gedrückt wird
  private editPicture(itemToEdit: any): void {
    //Es muss zur Seite zum Hinzufügen eines neuen Photos gesprungen werden
    this.router.navigate(this.routeForEdit + "/edit/" + this.selectedFatherItem.ID + "/" + itemToEdit.ID);
  }

  //Wird aufgerufen wenn auf den Refresh-Button gedrückt wird
  public async refreshList(): Promise<void> {
    //Einblenden der Busy-Box
    this.setBusyState(true);

    //Laden der Bilder über ein Promise
    this.entities = await this.service.getData(this.selectedFatherItem.ID);

    //Ausblenden der Busy-Box
    this.setBusyState(false);
  }
}
