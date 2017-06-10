import { EntityBase } from './../../../Models/Entities/EntityBase';
import {EntityManagerFactory} from '../../../Helper/EntityManagerFactory';
import {ServiceModelLoadDataDelete} from '../../../Helper/ServiceHelper';
import {EntityQuery, QueryResult, SaveResult, Entity} from 'breeze-client';
import {autoinject} from 'aurelia-dependency-injection';

@autoinject()
export class PictureUploadService extends ServiceModelLoadDataDelete {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Upload-Picture vom Server
    public async getData(): Promise<Array<EntityBase>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('UploadPictures')
            .where('Status', '==', 0);

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Ausführen der Query
        var Result: QueryResult = await this.manager.executeQuery(query);

        //Setzen Funktionsergebnis
        return Promise.resolve(Result.results);
    }
  
    public async deleteItem(ID: number): Promise<SaveResult> {
        //Ermitteln der Entity
        var entityDelete: Entity = this.manager.getEntityByKey('UploadPictureItem', ID);
            
        //Entfernen des Items aus dem Manager
        entityDelete.entityAspect.setDeleted();

        //Speichern der Änderungen
        return this.manager.saveChanges();
    }
}
