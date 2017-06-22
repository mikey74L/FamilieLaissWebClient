import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from '../../../Helper/ServiceHelper'
import { autoinject } from 'aurelia-dependency-injection';
import { enEntityType } from '../../../Enum/FamilieLaissEnum';
import { MediaGroup } from '../../../Models/Entities/MediaGroup';
import { enMediaType } from '../../../Enum/FamilieLaissEnum';

@autoinject()
export class AlbumService extends ServiceModelStammdatenNormal<MediaGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.MediaGroup);
    }

    //Ermittelt alle Alben vom Server 
    public async getData(): Promise<Array<MediaGroup>> {
        //Ermitteln der Daten
        return this.repository.find();
    }
}

@autoinject()
export class AlbumServiceEdit extends ServiceModelStammdatenEditNormal<MediaGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.MediaGroup);
    }

    //Erstellt ein neues Album im Entity-Manager
    public createNew(): MediaGroup {
        //Ermitteln der Entity
        let ReturnValue: MediaGroup = this.repository.getNewEntity();

        //Setzen des Standard-Wertes für den Typ
        ReturnValue.Type = enMediaType.Picture;

        //Wert zurückliefern
        return ReturnValue;
    }
}
