import { bindable, customElement, containerless } from 'aurelia-framework';
import { autoinject } from 'aurelia-framework'; 
import { I18N } from 'aurelia-i18n';
import 'bootstrap-select';
import { SelectPickerListMultiple } from '../Helper/SelectPickerHelper';
import 'bootstrap-select/dist/css/bootstrap-select.css';

@customElement('select-picker-multiple')
@containerless()
@autoinject()
export class SelectPickerMultiple {
    //Bindable Properties
    @bindable() id: string;
    @bindable() items: SelectPickerListMultiple;
    @bindable() title: string;
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
            size: 20
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
        var values: Array<any>;

        //Auswerten der aktuellen Selektion
        values = $("#" + this.id).val();

        //Wenn nichts ausgewählt wurde, dann wird alles zurückgesetzt.
        //Ansonsten werden die Selektionen übernommen
        if (values != null) {
            //Zuerst alle Items zurücksetzen
            this.items.resetAll();

            //Schleife über alle Werte
            for (var ID of values) {
                //Setzen des Assigned Status
                this.items.setValue(ID);
            }
        }
        else {
            this.items.resetAll();
        }
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
