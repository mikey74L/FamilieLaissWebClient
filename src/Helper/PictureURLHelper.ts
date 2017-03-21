import {GeneralConfig} from '../Config/GeneralConfig';

export class PictureURLHelper {
    private getBaseImageURL(item: any) : string {
        //Deklarationen
        var URL: string;
        var FileExtension: string;

        //Ermitteln der Extension
        FileExtension = item.NameOriginal.substr(item.NameOriginal.lastIndexOf('.') + 1);

        //Zusammenstellen der URL für das Image
        //Das Image wird auf 300 x 200 über den ImageResizer auf dem Server geändert
        URL = GeneralConfig.baseURLImage + item.ID + '.' + FileExtension;

        //Funktionsergebnis
        return URL;
    }

    private addRotationInfo(url: string, item: any): string {
        //Deklarationen
        var URL: string;

        //Überprüfen ob eine Image-Property vorhanden ist
        //Wenn ja werden die entsprechenden Werte übernommen
        URL = url;
        if (item.ImageProperty != null) {
            URL = URL + '&rotate=' + item.ImageProperty.Rotate;
        }

        //Funktionsergebnis
        return URL;
    }

    public getImageURLUpload(uploadItem: any): string {
        //Deklarationen
        var URL: string;

        //Zusammenstellen der URL für das Image
        //Das Image wird auf 300 x 200 über den ImageResizer auf dem Server geändert
        URL = this.getBaseImageURL(uploadItem);
        URL = URL + '?width=300&height=230';

        //Etwaige Rotation zur URL hinzufügen
        URL = this.addRotationInfo(URL, uploadItem);

        //Setzen der aktuellen URL
        return URL;
    }

    public getImageURLBigPicture(pictureItem: any, modus: number): string {
        //Deklarationen
        var URL: string;

        //Zusammenstellen der URL für das Image
        //Das Image wird auf 300 x 200 über den ImageResizer auf dem Server geändert
        URL = this.getBaseImageURL(pictureItem);
        URL = URL + '?height=660';

        //Etwaige Rotation zur URL hinzufügen
        URL = this.addRotationInfo(URL, pictureItem);

        //Setzen der aktuellen URL
        return URL;
    }
}
