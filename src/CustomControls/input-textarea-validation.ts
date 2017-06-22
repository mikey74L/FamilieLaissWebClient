import {bindable, customElement, containerless, inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@customElement('input-textarea-validation')
@inject(I18N)
export class InputTextareaValidation {
    //Members
    @bindable labelIdentifier: string;
    @bindable value: any;
    @bindable isBusy: boolean;

    private loc: I18N;
    
    private toggled: boolean;
    private labelText: string;

    //C'tor
    constructor (localize: I18N) {
      //Übernehmen der Parameter
      this.loc = localize;
    }

    labelIdentifierChanged(): void {
      //Bestimmen der Beschriftung für das Label
      this.labelText = this.loc.tr(this.labelIdentifier, { ns: 'Metadata' });
    }

    //Wird aufgerufen wenn die Input-Box den Focus bekommt
    public elementGotFocus(): void {
        this.toggled = true;
    }

    //Wird aufgerufen wenn die Input-Box den Focus verliert
    public elementLostFocus(eventData: any): void {
        //Wenn sich ein Text im Eingabefeld befindet
        //dann darf nicht mehr getoggled werden
        if (eventData.srcElement.value.length == 0) {
            this.toggled = false;
        }
    }

    public attached(): void {
        //Wenn das Element zum Dom hinzugefügt wird, dann
        //wird überprüft ob schon ein Text vorhanden ist.
        //Wenn ja dann wird die toggled Eigenschaft gesetzt
        if (this.value) {
            if (this.value.length > 0) this.toggled = true;
        }
    }
}
