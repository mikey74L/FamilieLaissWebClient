import {customAttribute, autoinject} from 'aurelia-framework';
import 'bootstrap';

@customAttribute('bootstrap-dropdown')
@autoinject()
export class BootstrapDropdown {
    //Members
    element: Element;

    //C'tor
    constructor(element: Element) {
        //Übernehmen der Parameter
        this.element = element;
    }

    //Wird von Aurelia aufgerufen wenn das Element "binded" wurde
    public bind(): void {
        //Initialisieren des Dropdowns
        $(this.element).dropdown();
    }

    //Wird von Aurelia aufgerufen wenn das Element "unbinded" wurde
    public unbind():void {
    }
}
