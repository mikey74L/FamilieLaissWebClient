import {customAttribute, autoinject} from 'aurelia-framework';
import waves from 'node-waves';

@customAttribute('button-waves')
@autoinject()
export class ButtonWaves {
    //Members
    element: HTMLElement;

    //C'tor
    constructor(element: HTMLElement) {
        //Übernehmen der Parameter
        this.element = element;
    }

    //Wird von Aurelia aufgerufen wenn das Attribut zum DOM hinzugefügt wurde 
    attached(): void {
        waves.attach(this.element, ['waves-circle', 'waves-float']);
        waves.init();
    }
}
