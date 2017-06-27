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

    //Ermittelt alle Alben vom angegebenen Typ Server
    public async getData(type: enMediaType): Promise<Array<MediaGroup>> {
      //Query zusammenstellen
      let Query = this.getQueryBuilder<MediaGroup>();
      Query.equals(x => x.Type, type);

      //Ermitteln der Daten
      return this.repository.find(this.getQueryStringFromQuery<MediaGroup>(Query));
    }

    //Ermittelt alle Alben vom angegebenen Typ vom Server absteigend sortiert
    //nach dem Erstellungsdatum
    public async getDataOrderd(type: enMediaType): Promise<Array<MediaGroup>> {
      //Query zusammenstellen
      let Query = this.getQueryBuilder<MediaGroup>();
      Query.equals(x => x.Type, type);
      Query.orderByDescending(x => x.DDL_Create);

      //Ermitteln der Daten
      return this.repository.find(this.getQueryStringFromQuery<MediaGroup>(Query));
    }
}
