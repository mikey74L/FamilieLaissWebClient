import {ViewModelGeneralDialog} from '../Helper/ViewModelHelper';
import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogController} from 'aurelia-dialog';
import {PictureURLHelper} from '../Helper/PictureURLHelper';

@autoinject()
export class ChangeImagePropertiesDialog extends ViewModelGeneralDialog {
    //Config für i18N
    locConfig: any = { ns: ['Dialogs'] };

    //Members
    URLHelper: PictureURLHelper;

    //C'tor
    constructor (localize: I18N, eventAggregator: EventAggregator, urlHelper:PictureURLHelper, dialogController: DialogController) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, dialogController);

        //Übernehmen der Parameter
        this.URLHelper = urlHelper;
    }

    //Wird von Aurelia aufgerufen wenn der Dialog angezeigt wird
    protected async activateChild(info: any): Promise<void> {
    }

    //Wird von Aurelia aufgerufen
    protected checkEnabledState(): void {

    }

    //Wird von Aurelia aufgerufen
    protected busyStateChanged(): void {

    }
}
