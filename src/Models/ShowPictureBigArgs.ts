export class ShowPictureBigArgs {
    //Members
    item: any;
    nameForImage: string;
    additionalRotation?: number;

    //C'tor
    constructor (nameForImage: string, item: any, additionalRotation?: number) {
        //Übernehmen der Parameter
        this.item = item;
        this.nameForImage = nameForImage;
        this.additionalRotation = additionalRotation;
    }
}
