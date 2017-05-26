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
    uploadItem: any;

    //Properties für den Slider
    sliderIncrementStep: number = 90;
    sliderMinValue: number = 0;
    sliderMaxValue: number = 360;
    sliderShowScale: boolean = true;
    sliderShowSmallTicks: boolean = false;
    sliderSmallStep: number = 90;
    sliderLargeStep: number = 90;
    sliderValue: number = 0;
    sliderEnabled: boolean = false;

    //C'tor
    constructor (localize: I18N, eventAggregator: EventAggregator, urlHelper:PictureURLHelper, dialogController: DialogController) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, dialogController);

        //Übernehmen der Parameter
        this.URLHelper = urlHelper;
    }

    //Wird von Aurelia aufgerufen wenn der Dialog angezeigt wird
    protected async activateChild(info: any): Promise<void> {
      //Übernehmen des Upload-Items übergeben wird ein Objekt vom Typ ChangeImagePropertyStartArgs
      this.uploadItem = info.uploadItem;

      //Übernehmen einer eventuell schon existierenden Rotation
      if (this.uploadItem.ImageProperty != null) {
        this.sliderValue = this.uploadItem.ImageProperty.Rotate;
      }
    }

    //Wird von Aurelia aufgerufen
    protected checkEnabledState(): void {

    }

    //Wird von Aurelia aufgerufen
    protected busyStateChanged(): void {

    }
    
    //Übernehmen der Rotation
    private takeOver(): void {
      //Übernehmen der aktuellen Rotation und schließen des Dialoges
      this.controller.ok(this.sliderValue);
    }

    //Wird vom Cancel-Button aufgerufen
    private cancel(): void {
      //Schließen des Dialoges
      this.controller.cancel();
    }

    //Wird als Callback vom Rotation-Picture-Control aufgerufen wenn
    //das Bild fertig geladen wurde
    private enableSlider(): void {
      this.sliderEnabled = true;
    }

    //Wird als Callback vom Rotation-Picture-Control aufgerufen wenn
    //das Bild geladen wird
    private disableSlider(): void {
      this.sliderEnabled = false;
    }
}
