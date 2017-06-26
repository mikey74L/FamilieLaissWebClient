import { autoinject } from 'aurelia-dependency-injection';
import { ServiceModel } from '../Helper/ServiceHelper';
import { MediaGroup } from '../Models/Entities/MediaGroup';
import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { enEntityType, enMediaType } from '../Enum/FamilieLaissEnum';

@autoinject()
export class ChooseAlbumDialogService extends ServiceModel<MediaGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.MediaGroup);
    }

    //Ermittelt alle Photo-Alben vom Server
    public async getData(type: enMediaType): Promise<Array<MediaGroup>> {
      //Query zusammenstellen
      let Query = this.getQueryBuilder<MediaGroup>();
      Query.equals(x => x.Type, type);

      //Ermitteln der Daten
      return this.repository.find(this.getQueryStringFromQuery<MediaGroup>(Query));
    }
}
