import { ServiceModelStammdatenNormal } from '../../../Helper/ServiceHelper'
import { EntityQuery, Entity, QueryResult, SaveResult } from 'breeze-client';

export class AlbumService extends ServiceModelStammdatenNormal {
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
