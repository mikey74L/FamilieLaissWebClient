import {GeneralConfig} from '../Config/GeneralConfig';

export class PictureURLHelper {
    public getImageURL(uploadItem: any): string {
        //Deklarationen
        var URL: string;
        var FileExtension: string;

        //Ermitteln der Extension
        FileExtension = uploadItem.NameOriginal.substr(uploadItem.NameOriginal.lastIndexOf('.') + 1);

        //Zusammenstellen der URL für das Image
        //Das Image wird auf 300 x 200 über den ImageResizer auf dem Server geändert
        URL = GeneralConfig.baseURLImage + uploadItem.ID + '.' + FileExtension;
        URL = URL + '?width=300&height=230';

        //Überprüfen ob eine Image-Property vorhanden ist
        //Wenn ja werden die entsprechenden Werte übernommen
        if (uploadItem.ImageProperty != null) {
            URL = URL + '&rotate=' + uploadItem.ImageProperty.Rotate;
        }

        //Setzen der aktuellen URL
        return URL;
    }
}
