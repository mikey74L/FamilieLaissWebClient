import {customAttribute, autoinject} from 'aurelia-framework';
import * as $ from 'jquery';
import autosize from 'autosize';

@customAttribute('autosize-textarea')
@autoinject()
export class AutosizeTextarea {
    //Members
    element: Element;

    //C'tor
    constructor(element: Element) {
        this.element = element;
    }

    public bind(): void {
        autosize($(this.element));
    }
}
