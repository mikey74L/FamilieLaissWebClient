import { EntityBase } from './../../../Models/Entities/EntityBase';
import { EntityManagerFactory } from '../../../Helper/EntityManagerFactory';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from '../../../Helper/ServiceHelper'
import { EntityQuery, Entity, QueryResult, SaveResult } from 'breeze-client';
import {autoinject} from 'aurelia-dependency-injection';

@autoinject()
export class CategoryService extends ServiceModelStammdatenNormal {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Kategorien vom Server oder wenn schon mal geladen aus dem EntityManager lokal
    public async getData(): Promise<Array<EntityBase>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('FacetGroups');

        //Query in einem Promise ausführen 
        if (!this.loadedFromServer) {
            //Ermitteln des Entity-Manager
            await this.getEntityManager();

            //Ausführen der Query
            var Result: QueryResult = await this.manager.executeQuery(query);

            //Setzen des Flags und Funktionsergebnis
            this.loadedFromServer = true;
            return Promise.resolve(Result.results);
        }
        else {
            return Promise.resolve(this.manager.executeQueryLocally(query));
        }
    }

    //Holt die Daten neu vom Server
    public async refreshData(): Promise<Array<EntityBase>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaGroups')
            .where("FacetValueType", "==", 1);

        //Ausführen der Query
        var Result: QueryResult = await this.manager.executeQuery(query);

        //Funktionsergebnis
        return Promise.resolve(Result.results);
    }

    //Löscht ein Item 
    public async deleteItem(ID: number): Promise<SaveResult> {
        //Ermitteln der Entity
        var entityDelete: Entity = this.manager.getEntityByKey('FacetGroup', ID);
            
        //Entfernen des Items aus dem Manager
        entityDelete.entityAspect.setDeleted();

        //Speichern der Änderungen
        return this.manager.saveChanges();
    }
}

@autoinject()
export class CategoryServiceEdit extends ServiceModelStammdatenEditNormal {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt die Daten für eine einzelne Kategorie
    //um dieses zu editieren
    public async getItem(ID: number): Promise<EntityBase> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('FacetGroups')
            .where('ID', '==', ID);
        
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query ausführen
        var Result: Array<any> = this.manager.executeQueryLocally(query);
        
        //Promise zurückliefern
        return Promise.resolve(Result[0]);
    }

    //Erstellt eine neue Kategorie im Entity-Manager
    public async createNew(): Promise<EntityBase> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Return-Value
        var RetVal: any = this.manager.createEntity('FacetGroup');
        RetVal.Type = 0;

        //Promise zurückliefern 
        return Promise.resolve(RetVal);
    }

    //Speichert die Änderungen auf dem Server
    public async saveChanges(): Promise<SaveResult> {
        //Speichern der Änderungen mit einem Promise
        return this.manager.saveChanges();
    }
}
