import { bindable, customElement, containerless } from 'aurelia-framework';
import { autoinject } from 'aurelia-framework'; 
import * as $ from 'jquery';
import selectpicker from 'bootstrap-select';
import { I18N } from 'aurelia-i18n';
import { SelectPickerListSingle } from '../Helper/SelectPickerHelper';

@customElement('select-picker-single')
@containerless()
@autoinject()
export class SelectPickerSingle {
    //Bindable Properties
    @bindable() id: string;
    @bindable() items: SelectPickerListSingle;
    @bindable () isBusy: boolean;

    //Members
    loc: I18N;

    //C'tor
    constructor(loc: I18N) {
        //Übernehmen der Parameter
        this.loc = loc;
    }
    
    //Wird von Aurelia aufgerufen
    public attached(): void {
        //Initialisieren des Select-Picker-Controls
        $("#" + this.id).selectpicker({
            size: 'auto'
        });

        //Event-Handler für Selektions-Änderung verdrahten
        $("#" + this.id).on('changed.bs.select', (e) => {
            //Aufrufen der Methode zum Auswerten der aktuellen Selektion
            this.takeOverCurrentSelection();
        });
    }

    //Übernimmt die aktuelle Selektion des Select-Pickers in
    //die Liste
    private takeOverCurrentSelection(): void {
        //Deklarationen
        var value: number;

        //Auswerten der aktuellen Selektion
        value = $("#" + this.id).val();

        //Setzen des Values in der Item-Liste
        this.items.setValue(value);
    }

    //Wird aufgerufen wenn sich der Wert von isBusy über das Binding von außen ändert
    //Dann muss die Select-Box entsprechend gesperrt oder entsperrt werden
    private isBusyChanged(): void {
        if (this.isBusy) {
            $('#' + this.id).prop('disabled', true);
        }
        else {
            $('#' + this.id).prop('disabled', false);
        }
        $('#' + this.id).selectpicker('refresh');
    }
}
