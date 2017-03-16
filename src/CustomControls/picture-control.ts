import {bindable, customElement, containerless} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {autoinject} from 'aurelia-framework'; 
import {I18N} from 'aurelia-i18n';
import {DeletePictureEvent, ChoosePictureEvent, EditPictureEvent} from '../Events/PictureEvents';
import {PictureURLHelper} from '../Helper/PictureURLHelper';
// import {ShowPictureStartArgs} from '../helper/FamilieLaissHelper';
import {DialogService} from 'aurelia-dialog';
// import {ShowPictureDialog} from '../CustomDialogs/ShowPictureDialog';

@customElement('picture-control')
@containerless()
@autoinject()
export class PictureControl {
    //Optionen für i18N
    locConfig: any = { ns: 'Controls' };

    //Control-Properties
    URLHelper: PictureURLHelper;
    pictureItem: any;
    uploadItem: any;
    @bindable() item: any;

    //Der Modus bestimmt aus welchem Kontext das Control angezeigt wird. Je nach Modus werden unterschiedliche
    //Controls und Informationen angezeigt
    //1 = Upload-Item aus der Liste der Upload-Items
    //2 = Auswahl eines Upload-Items beim Hinzufügen eines neuen Photos zu einem Album
    //3 = Liste der zugewiesenen Photos zu einem Album in der Liste für die Administration
    @bindable() modus: number;

    i18nContext: string;

    //Members
    loc: I18N;
    aggregator: EventAggregator;
    dialog;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, urlHelper: PictureURLHelper) {
        //Übernehmen der Parameter
        this.loc = loc;
        this.aggregator = eventAggregator;
        // this.dialog = dialog;
        this.URLHelper = urlHelper;

        //Initialisieren
        this.modus = -1;
        this.item = null;
    }
  
    //Je nach Modus auftrennen des Items in seine Bestandteile
    private seperateItem(): void {
        switch (this.modus) {
            case 1:
                this.pictureItem = null;
                this.uploadItem = this.item;
                break;
            case 2:
                this.pictureItem = null;
                this.uploadItem = this.item;
                break;
            case 3:
                this.pictureItem = this.item;
                this.uploadItem = this.item.UploadPicture;
                break;
        }
    }

    //Wird von Aurelia aufgerufen wenn sich das Item durch das Binding geändert hat
    private itemChanged(): void {
        if (this.modus != -1 && this.item != null) {
            //Separieren des Items
            this.seperateItem();
        }
    }

    //Wird von Aurelia aufgerufen wenn sich der Modus durch das Binding geändert hat
    private modusChanged(): void {
        switch(this.modus) {
            case 1:
                this.i18nContext = 'Upload';
                break;
            case 2:
                this.i18nContext = 'Upload';
                break;
            case 3:
                this.i18nContext = 'Album';
                break;
        }

        if (this.modus != -1 && this.item != null) {
            //Separieren des Items
            this.seperateItem();
        }
    }

    //Ermittelt die Image-URL für das übergebene Image
    private getImageURL(): string {
        //Return-Value
        return this.URLHelper.getImageURL(this.uploadItem);
    }

    //Zeigt das ausgewählte Photo in Großansicht an
    public showPicture(): void {
        // //Aufrufen des Aurelia-Dialoges zur Anzeige des Bildes
        // //im Großformat
        // this.dialog.open({ viewModel: ShowPictureDialog, model: new ShowPictureStartArgs(1, this.uploadItem)}).then(response => {
        //     if (response.wasCancelled) {
        //         //Nichts zu tun
        //     } 
        //     else {
        //         //Nichts zu tun
        //     }
        // });
    }

    //Das Bild soll gelöscht werden. 
    public deletePicture(): void {
        //Feuern des entsprechenden Events
        switch (this.modus) {
            case 1:
                this.aggregator.publish(new DeletePictureEvent(this.uploadItem));
                break;
            case 2:
                this.aggregator.publish(new DeletePictureEvent(this.uploadItem));
                break;
            case 3:
                this.aggregator.publish(new DeletePictureEvent(this.pictureItem));
                break;
        }
    }

    //Das Bild soll ausgewählt werden
    public choosePicture(): void {
        //Feuern des entsprechenden Events
        this.aggregator.publish(new ChoosePictureEvent(this.uploadItem));
    }

    //Das Bild soll editiert werden
    public editPicture(): void {
        //Feuern des entsprechenden Events
        switch (this.modus) {
            case 1:
                this.aggregator.publish(new EditPictureEvent(this.uploadItem));
                break;
            case 2:
                this.aggregator.publish(new EditPictureEvent(this.uploadItem));
                break;
            case 3:
                this.aggregator.publish(new EditPictureEvent(this.pictureItem));
                break;
        }
    }
}
