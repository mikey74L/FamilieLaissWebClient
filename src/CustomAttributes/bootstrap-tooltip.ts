import {customAttribute, autoinject} from 'aurelia-framework';
import 'bootstrap';

@customAttribute('bootstrap-tooltip')
@autoinject()
export class BootstrapTooltip {
    //Members
    element: Element;

    //C'tor
    constructor(element: Element) {
        //Übernehmen der Parameter
        this.element = element;
    }

    //Wird von Aurelia aufgerufen wenn das Element "binded" wurde
    public bind(): void {
        //Initialisieren des Tooltips
        $(this.element).tooltip();

        //Wenn auf das Item geklickt wird, wird der Tooltip ausgeblendet
        $(this.element).on('click', () => {
            //Ausblenden des Tooltips
            $(this.element).tooltip('hide')
        });
    }

    //Wird von Aurelia aufgerufen wenn das Element "unbinded" wurde
    public unbind():void {
        $(this.element).tooltip('destroy');
    }
}
