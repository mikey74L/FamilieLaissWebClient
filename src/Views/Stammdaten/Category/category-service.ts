import { enFacetType } from 'Enum/FamilieLaissEnum';
import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from '../../../Helper/ServiceHelper'
import { autoinject } from 'aurelia-dependency-injection';
import { enEntityType } from '../../../Enum/FamilieLaissEnum';

@autoinject()
export class CategoryService extends ServiceModelStammdatenNormal<FacetGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.FacetGroup);
    }

    //Ermittelt alle Kategorien vom Server oder wenn schon mal geladen aus dem EntityManager lokal
    public async getData(): Promise<Array<FacetGroup>> {
        //Ermitteln der Daten
        return this.repository.find();
    }

    //Löscht ein Item 
    public async deleteItem(ID: number): Promise<Response> {
        //Ermitteln der Entity
        var entityDelete: Entity = await this.repository.findOne(ID);
            
        //Speichern der Änderungen
        return entityDelete.destroy();
    }
}

@autoinject()
export class CategoryServiceEdit extends ServiceModelStammdatenEditNormal<FacetGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.FacetGroup);
    }

    //Ermittelt die Daten für eine einzelne Kategorie
    //um dieses zu editieren
    public async getItem(ID: number): Promise<FacetGroup> {
        //Promise zurückliefern
        return this.repository.findOne(ID);
    }

    //Erstellt eine neue Kategorie im Entity-Manager
    public createNew(): FacetGroup {
        //Ermitteln der Entity
        let ReturnValue: FacetGroup = this.repository.getNewEntity();

        //Setzen des Standard-Wertes für den Typ
        ReturnValue.Type = enFacetType.Both;

        //Wert zurückliefern
        return ReturnValue;
    }
}
