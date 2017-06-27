import { ServiceModelShow } from '../../Helper/ServiceHelper'
import { MediaItem } from '../../Models/Entities/MediaItem';
import { MediaGroup } from '../../Models/Entities/MediaGroup';
import { enEntityType } from '../../Enum/FamilieLaissEnum';
import { EntityManager } from 'aurelia-orm';

export class PictureShowService extends ServiceModelShow<MediaItem, MediaGroup> {
  //C'tor
  constructor (manager: EntityManager) {
    //Aufrufen des Vater Constructor
    super(manager);

    //Repository erstellen
    this.getRepository(enEntityType.MediaItem);
    this.getRepositoryFather(enEntityType.MediaGroup);
  }

  //Ermittelt die Medien-Elemente vbom Server
  public getData(idFather: number): Promise<Array<MediaItem>> {
    //Query zusammenstellen
    let Query = this.getQueryBuilder<MediaItem>();
    Query.equals(x => x.ID_Group, idFather);

    //Ermitteln der Daten
    return this.repository.find(this.getQueryStringFromQuery<MediaItem>(Query));
  }
}
