import {bindable, customElement, containerless, DOM, inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@customElement('input-text-validation')
@inject(I18N)
export class InputTextValidation {
    //Members
    @bindable labelIdentifier: string;
    @bindable value: any;
    @bindable isBusy: boolean;
    @bindable inputType: string;

    private loc: I18N;
    
    private toggled: boolean;
    private labelText: string;

    constructor (localize: I18N) {
      //Übernehmen der Parameter
      this.loc = localize;
    }

    labelIdentifierChanged(): void {
      //Bestimmen der Beschriftung für das Label
      this.labelText = this.loc.tr(this.labelIdentifier, { ns: 'Metadata' });
    }

    //Wird aufgerufen wenn die Input-Box den Focus bekommt
    elementGotFocus(): void {
        this.toggled = true;
    }

    //Wird aufgerufen wenn die Input-Box den Focus verliert
    elementLostFocus(eventData: any): void {
        //Wenn sich ein Text im Eingabefeld befindet
        //dann darf nicht mehr getoggled werden
        if (eventData.srcElement.value.length == 0) {
            this.toggled = false;
        }
    }

    attached() {
        //Wenn das Element zum Dom hinzugefügt wird, dann
        //wird überprüft ob schon ein Text vorhanden ist.
        //Wenn ja dann wird die toggled Eigenschaft gesetzt
        if (this.value) {
            if (this.value.length > 0) this.toggled = true;
        }
    }
}
