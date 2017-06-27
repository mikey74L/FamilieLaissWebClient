import {inject, customAttribute} from 'aurelia-framework'

@customAttribute('auto-focus')
@inject(Element)
export class AutoFocus {
  //Members
  private element: Element;

  //C'tor
  constructor(element: Element) {
    this.element = element;
  }

  //Wenn das Element zum Dom hinzugefügt wird, dann setzen des Focus
  attached(): void {
    //Ermitteln des Input-Elements
    let inputElements: NodeListOf<Element> = this.element.getElementsByTagName('input');
    if (inputElements.length > 0) {
      let inputElement: HTMLInputElement = inputElements[0] as HTMLInputElement;
      inputElement.focus();
    }
  }
}
