import { SortCriteria } from './../../../Models/SortCriteria';
import {ViewModelGeneralDataDelete} from '../../../Helper/ViewModelHelper';
import {I18N} from 'aurelia-i18n';
import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {AppRouter} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';
import {enSortDirection} from '../../../Enum/FamilieLaissEnum';
import {UploadInProgressEvent} from '../../../Events/UploadControlEvents';
import {PictureUploadService} from './picture-upload-service';

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

    //Wird von Aurelia aufgerufen
    public deactivate(): void {
        //Deregistrieren beim Event-Aggregator
        this.subscribeProgressEvent.dispose();
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
