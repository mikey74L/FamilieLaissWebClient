import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { ServiceModelLoadDataDelete } from '../../../Helper/ServiceHelper'
import { autoinject } from 'aurelia-dependency-injection';
import { enEntityType } from '../../../Enum/FamilieLaissEnum';
import { UploadPictureItem } from '../../../Models/Entities/UploadPictureItem';
import { enUploadPictureStatus } from '../../../Enum/FamilieLaissEnum';

@autoinject()
export class PictureUploadService extends ServiceModelLoadDataDelete<UploadPictureItem> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.UploadPictureItem);
    }

    //Ermittelt alle Upload-Picture vom Server
    public async getData(): Promise<Array<UploadPictureItem>> {
      //Query zusammenbauen
      let Query = this.getQueryBuilder<UploadPictureItem>();
      Query.equals(x => x.Status, enUploadPictureStatus.Uploaded); 

      //Daten ermitteln
      return this.repository.find(this.getQueryStringFromQuery<UploadPictureItem>(Query));
    }
}
