import { EntityManagerFactory } from '../../../Helper/EntityManagerFactory';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from '../../../Helper/ServiceHelper'
import { EntityQuery, Entity, QueryResult, SaveResult } from 'breeze-client';
import {autoinject} from 'aurelia-dependency-injection';

@autoinject()
export class AlbumService extends ServiceModelStammdatenNormal {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Alben vom Server oder wenn schon mal geladen aus dem EntityManager lokal
    public async getData(): Promise<Array<any>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaGroups');

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
    public async refreshData(): Promise<Array<any>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaGroups');

        //Ausführen der Query
        var Result: QueryResult = await this.manager.executeQuery(query);

        //Funktionsergebnis
        return Promise.resolve(Result.results);
    }

    //Löscht ein Item 
    public async deleteItem(ID: number): Promise<SaveResult> {
        //Ermitteln der Entity
        var entityDelete: Entity = this.manager.getEntityByKey('MediaGroup', ID);
            
        //Entfernen des Items aus dem Manager
        entityDelete.entityAspect.setDeleted();

        //Speichern der Änderungen
        return this.manager.saveChanges();
    }
}

@autoinject()
export class AlbumServiceEdit extends ServiceModelStammdatenEditNormal {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt die Daten für ein einzelnes Album
    //um dieses zu editieren
    public async getItem(ID: number): Promise<any> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaGroups')
            .where('ID', '==', ID);
        
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query ausführen
        var Result: Array<Entity> = this.manager.executeQueryLocally(query);
        
        //Promise zurückliefern
        return Promise.resolve(Result);
    }

    //Erstellt ein neues Album im Entity-Manager
    public async createNew(): Promise<any> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Return-Value
        var RetVal: any = this.manager.createEntity('MediaGroup');
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
