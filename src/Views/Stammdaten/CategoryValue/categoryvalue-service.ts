import {ServiceModelStammdatenID, ServiceModelStammdatenEditID} from '../../../Helper/ServiceHelper';
import {LoadDataWithFatherModel} from '../../../Models/LoadDataWithFatherModel';
import {EntityManagerFactory} from '../../../Helper/EntityManagerFactory';
import {EntityQuery, Entity, Predicate, QueryResult, SaveResult} from 'breeze-client';

export class CategoryValueService extends ServiceModelStammdatenID {
    //Ermittelt alle Kategorie-Werte für eine Kategorie 
    public async getData(ID: number): Promise<LoadDataWithFatherModel> {
        //Query für die Group zusammenbauen
        var PredicateGroup: Predicate = Predicate
            .create('ID', '==', ID);
        var queryGroup: EntityQuery = new EntityQuery()
            .from('FacetGroups')
            .where(PredicateGroup);

        //Query für die Werte zusammenbauen
        var PredicateValues: Predicate = Predicate
            .create('ID_Group', '==', ID);
        var queryValues: EntityQuery = new EntityQuery()
            .from('FacetValues')
            .where(PredicateValues);

        //Erstellen des Return-CategoryValues
        var ReturnValue: LoadDataWithFatherModel = new LoadDataWithFatherModel();

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Ausführen der Query für die Group
        var Result: QueryResult = await this.manager.executeQuery(queryGroup);
        ReturnValue.fatherItem = Result.results[0];

        //Ausführen der Query für die Values
        var Result: QueryResult = await this.manager.executeQuery(queryValues);
        ReturnValue.entities = Result.results;

        //Setzen des Flags und Funktionsergebnis
        this.loadedFromServer = true;
        return Promise.resolve(ReturnValue);
    }

    //Holt die Daten neu vom Server
    public async refreshData(ID: number): Promise<LoadDataWithFatherModel> {
      return this.getData(ID);
    }

    //Löscht ein Item 
    public async deleteItem(ID: number): Promise<SaveResult> {
        //Ermitteln der Entity
        var entityDelete: Entity = this.manager.getEntityByKey('FacetValue', ID);
            
        //Entfernen des Items aus dem Manager
        entityDelete.entityAspect.setDeleted();

        //Speichern der Änderungen
        return this.manager.saveChanges();
    }
}
