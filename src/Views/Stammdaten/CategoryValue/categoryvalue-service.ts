import { EntityBase } from './../../../Models/Entities/EntityBase';
import {ServiceModelStammdatenID, ServiceModelStammdatenEditID} from '../../../Helper/ServiceHelper';
import {LoadDataWithFatherModel, EditDataWithFatherModel} from '../../../Models/LoadDataWithFatherModel';
import {EntityManagerFactory} from '../../../Helper/EntityManagerFactory';
import {EntityQuery, Entity, Predicate, QueryResult, SaveResult} from 'breeze-client';
import {autoinject} from 'aurelia-dependency-injection';

@autoinject()
export class CategoryValueService extends ServiceModelStammdatenID {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

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

@autoinject()
export class CategoryValueServiceEdit extends ServiceModelStammdatenEditID {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt die Daten für einen einzelnen Kategorie-Wert
    //um diesen zu editieren
    public async getItem(ID: number, idFather: number): Promise<EditDataWithFatherModel> {
        //Query zusammenbauen
        var queryValue = new EntityQuery()
            .from('FacetValues')
            .where('ID', '==', ID);
        var queryCategory = new EntityQuery()
            .from('FacetGroups')
            .where('ID', '==', idFather);

        //Result-Value instanziieren 
        var ReturnValue: EditDataWithFatherModel = new EditDataWithFatherModel();

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Ausführen der Query für den Value
        var Result: Array<Entity> = this.manager.executeQueryLocally(queryValue);
        ReturnValue.editItem = Result[0];

        //Ausführen der Query für die Group
        Result = this.manager.executeQueryLocally(queryCategory);
        ReturnValue.fatherItem = Result[0];

        //Promise zurückliefern
        return Promise.resolve(ReturnValue);
    }

    //Ermittelt das Vater-Item
    public async getFather(idFather: number): Promise<EntityBase> {
        //Query zusammenbauen
        var queryCategory = new EntityQuery()
            .from('FacetGroups')
            .where('ID', '==', idFather);
 
        //Query für die Kategorie ausführen ausführen
        return Promise.resolve(this.manager.executeQueryLocally(queryCategory)[0]);
    }

    //Erstellt einen neuen Kategorie-Wert im Entity-Manager
    public async createNew(idFather: number): Promise<EntityBase> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Return-Value
        var RetVal: any = this.manager.createEntity('FacetValue');
        RetVal.ID_Group = idFather;

        //Promise zurückliefern 
        return Promise.resolve(RetVal);
    }

    //Speichert die Änderungen auf dem Server
    public async saveChanges(): Promise<SaveResult> {
        return this.manager.saveChanges();
    }
}
