import { autoinject } from 'aurelia-dependency-injection';
import { ServiceModel } from '../Helper/ServiceHelper';
import { UploadPictureItem } from '../Models/Entities/UploadPictureItem';
import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { enEntityType, enUploadPictureStatus } from '../Enum/FamilieLaissEnum';

@autoinject()
export class ChooseUploadPictureDialogService extends ServiceModel<UploadPictureItem> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.UploadPictureItem);
    }

    //Ermittelt alle Upload-Photos die noch nicht zugewiesen sind vom Server
    public async getData(): Promise<Array<UploadPictureItem>> {
      //Query zusammenstellen
      let Query = this.getQueryBuilder<UploadPictureItem>();
      Query.equals(x => x.Status, enUploadPictureStatus.Uploaded);

      //Ermitteln der Daten
      return this.repository.find(this.getQueryStringFromQuery<UploadPictureItem>(Query));
    }
}
