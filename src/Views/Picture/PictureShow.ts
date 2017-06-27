import {inject, NewInstance} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {ViewModelShow} from '../..//Helper/ViewModelHelper';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {ValidationController} from 'aurelia-validation';
import { SortCriteria } from '../../Models/SortCriteria';
import { MediaGroup } from '../../Models/Entities/MediaGroup';
import { MediaItem } from '../../Models/Entities/MediaItem';
import {DialogService, DialogCloseResult} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import { enSortDirection } from '../../Enum/FamilieLaissEnum';
import { PictureShowService } from './PictureShowService';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), DialogService, AppRouter, PictureShowService)
export class PictureShow extends ViewModelShow<MediaItem, MediaGroup> {
  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogService: DialogService, router: AppRouter, 
               service: PictureShowService) {
    //Aufrufen des Vaters
    super(localize, eventAggregator, validationController, dialogService, router, service);

    //Konfiguration für Lokalisierung
    this.locConfig = { ns: ['PictureShow', 'translation']};
    this.sortHeaderNamespace = 'PictureShow';

    //Setzen des Textes für das Auswählen eines Albums
    this.albumChoosed = false;
    this.albumContext = 'notchoosed';
    this.sortCriteriaHeaderText = this.loc.tr('ChooseAlbum', this.locConfig);

    //Befüllen der Liste der Sortkriterien
    let SortCriteriaAdd: SortCriteria;

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.NameOriginal';
    SortCriteriaAdd.localizeName = 'Name';
    SortCriteriaAdd.direction = enSortDirection.Ascending;
    SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.NameAscending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.NameOriginal';
    SortCriteriaAdd.localizeName = 'Name';
    SortCriteriaAdd.direction = enSortDirection.Descending;
    SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.NameDescending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'CreateDate';
    SortCriteriaAdd.localizeName = 'AssignDate';
    SortCriteriaAdd.direction = enSortDirection.Ascending;
    SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.AssignDateAscending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'CreateDate';
    SortCriteriaAdd.localizeName = 'AssignDate';
    SortCriteriaAdd.direction = enSortDirection.Descending;
    SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.AssignDateDescending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.UploadDate';
    SortCriteriaAdd.localizeName = 'UploadDate';
    SortCriteriaAdd.direction = enSortDirection.Ascending;
    SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.UploadDateAscending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    SortCriteriaAdd = new SortCriteria();
    SortCriteriaAdd.propertyName = 'UploadPicture.UploadDate';
    SortCriteriaAdd.localizeName = 'UploadDate';
    SortCriteriaAdd.direction = enSortDirection.Descending;
    SortCriteriaAdd.displayText = this.loc.tr('Card.Header.SortMenuItems.UploadDateDescending', this.locConfig);
    this.sortCriteriaList.push(SortCriteriaAdd);

    //Initialisieren 
    this.entities = [];
  }

  //Wird von der Vater-Klasse aufgerufen wenn die View vom Router
  //aktiviert wird aber noch nicht angezeigt. 
  protected async activateChild(info: any): Promise<void> {
  }

  //Wird vom Framework aufgerufen wenn sich der isBusy-Status geändert hat
  protected busyStateChanged(): void {
  }

  //Überprüft den Enabled State
  protected checkEnabledState(): void {
  }
}
