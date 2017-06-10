import { MenuItemModel } from './../Models/MenuItemModel';
import {bindable, customElement, containerless} from 'aurelia-framework';
import * as $ from 'jquery';

@customElement('side-menu')
@containerless()
export class SideMenu {
    @bindable() menuItems: Array<MenuItemModel> = [];

    //Wird aufgerufen wenn auf ein Untermenu geklickt wird.
    //Hiermit wird das Untermenu ein bzw. aufgeklappt
    subMenuClicked(eventdata: Event) {
        if (eventdata.srcElement != null) {
            $(eventdata.srcElement).next().slideToggle(200);
            $(eventdata.srcElement).parent().toggleClass('toggled');
        }
    }
}

  