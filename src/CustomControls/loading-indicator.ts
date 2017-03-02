import * as NProgress from 'nprogress';
import {bindable, customElement, containerless} from 'aurelia-framework';

@customElement('loading-indicator')
@containerless()
export class LoadingIndicator {
    //Members
    @bindable({ changeHandler: 'valueHasChanged' }) loading: boolean;
    isAttached: boolean;

    //C'tor
    constructor() {
        this.isAttached = false;
    }

    //Wird von der Binding-Engine aufgerufen wenn sich der Wert von "loading" geändert hat
    private valueHasChanged(newValue: boolean): void {
        if (this.isAttached) {
            if (newValue) {
                NProgress.start();
            } else {
                NProgress.done();
            }
        }
    }

    public attached(): void {
        //Wenn das Element zum Dom hinzugefügt wird, dann
        //wird überprüft ob schon ein Text vorhanden ist.
        //Wenn ja dann wird die toggled Eigenschaft gesetzt
        NProgress.configure({ showSpinner: false });
        if (this.loading) {
            NProgress.start();
        }
        else {
            NProgress.done();
            NProgress.remove();
        }
        this.isAttached = true;
    }

    public detached(): void {
        this.isAttached = false;
        NProgress.done();
        NProgress.remove();
    }
}
