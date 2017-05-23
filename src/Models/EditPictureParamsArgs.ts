export class EditPictureParamsArgs {
    //Members
    modus: number;
    item: any;

    //C'tor
    constructor (modus: number, item: any) {
        //Übernehmen der Parameter
        this.item = item;
        this.modus = modus;
    }
}
