import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { enFacetType } from 'Enum/FamilieLaissEnum';
import { FacetValue } from './../../../Models/Entities/FacetValue';
import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { ServiceModelStammdatenID, ServiceModelStammdatenEditID } from '../../../Helper/ServiceHelper'
import { autoinject } from 'aurelia-dependency-injection';
import { enEntityType } from '../../../Enum/FamilieLaissEnum';

@autoinject()
export class CategoryValueService extends ServiceModelStammdatenID<FacetValue, FacetGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.FacetValue);
      this.getRepositoryFather(enEntityType.FacetGroup);
    }

    //Ermittelt alle Kategorie-Werte für eine Kategorie 
    public async getData(idFather: number): Promise<Array<FacetValue>> {
      //Query zusammenstellen
      let Query = this.getQueryBuilder<FacetValue>();
      Query.equals(x => x.ID_Group, idFather);

      //Ermitteln der Daten
      return this.repository.find(this.getQueryStringFromQuery<FacetValue>(Query));
    }
}

@autoinject()
export class CategoryValueServiceEdit extends ServiceModelStammdatenEditID<FacetValue, FacetGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.FacetValue);
      this.getRepositoryFather(enEntityType.FacetGroup);
    }

    //Erstellt einen neuen Kategorie-Wert im Entity-Manager
    public createNew(idFather: number): FacetValue {
        //Ermitteln der Entity
        let ReturnValue: FacetValue = this.repository.getNewEntity();

        //Return-Value
        ReturnValue.ID_Group = idFather;

        //Wert zurückliefern 
        return ReturnValue
    }
}
