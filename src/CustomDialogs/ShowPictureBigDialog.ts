import {ViewModelGeneralDialog} from '../Helper/ViewModelHelper';
import {PictureURLHelper} from '../Helper/PictureURLHelper';
import {DialogController} from 'aurelia-dialog';
import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';

@autoinject()
export class ShowPictureBigDialog extends ViewModelGeneralDialog {
    //Config für i18N
    locConfig: any = { ns: ['Dialogs'] };

    //Members
    URLHelper: PictureURLHelper;
    item: any;
    modus: number;
    currentName: string;

    //C'tor
    constructor (localize: I18N, eventAggregator: EventAggregator, urlHelper:PictureURLHelper, dialogController: DialogController) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, dialogController);

        //Übernehmen der Parameter
        this.URLHelper = urlHelper;
    }

    //Ermittelt die URL für das anzuzeigende Bild
    private getImageURL(): string {
      return this.URLHelper.getImageURLBigPicture(this.item, this.modus);
    }

    //Wird von Aurelia aufgerufen wenn der Dialog angezeigt wird
    protected async activateChild(info: any): Promise<void> {
        //Übernehmen des Items
        this.item = info.item;
        this.modus = info.modus;

        //Den aktuellen Namen ermitteln
        if (this.modus == 1) {
            this.currentName = this.item.Name;
        }
    }
 
    //Wird von Aurelia aufgerufen
    protected checkEnabledState(): void {

    }

    //Wird von Aurelia aufgerufen
    protected busyStateChanged(): void {

    }
}