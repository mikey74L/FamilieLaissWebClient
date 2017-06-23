import {ViewModelGeneralDialog} from '../Helper/ViewModelHelper';
import {PictureURLHelper} from '../Helper/PictureURLHelper';
import {DialogController} from 'aurelia-dialog';
import {inject, NewInstance } from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import { ValidationController } from 'aurelia-validation';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), PictureURLHelper, DialogController)
export class ShowPictureBigDialog extends ViewModelGeneralDialog {
    //Config für i18N
    locConfig: any = { ns: ['Dialogs'] };

    //Members
    URLHelper: PictureURLHelper;
    item: any;
    additionalRotation?: number;
    currentName: string;

    //C'tor
    constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, urlHelper:PictureURLHelper, dialogController: DialogController) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, validationController, dialogController);

        //Übernehmen der Parameter
        this.URLHelper = urlHelper;
    }

    //Wird von Aurelia aufgerufen wenn der Dialog angezeigt wird
    protected async activateChild(info: any): Promise<void> {
        //Übernehmen des Items
        this.item = info.item;
        this.currentName = info.nameForImage;
        this.additionalRotation = info.additionalRotation;
    }
 
    //Wird von Aurelia aufgerufen
    protected checkEnabledState(): void {

    }

    //Wird von Aurelia aufgerufen
    protected busyStateChanged(): void {

    }
}
