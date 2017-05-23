import { EntityManagerFactory } from '../../../Helper/EntityManagerFactory';
import {ServiceModel, ServiceModelAssign, ServiceModelAssignEdit} from '../../../Helper/ServiceHelper'
import {EditDataWithFatherModel, LoadDataWithFatherModel} from '../../../Models/LoadDataWithFatherModel';
import {EntityQuery, Entity, Predicate, QueryResult, SaveResult} from 'breeze-client';
import {autoinject} from 'aurelia-dependency-injection';

@autoinject()
export class PictureAdminService extends ServiceModelAssign {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Lädt die Photos für das Album mit der angegebenen ID
    //vom Server
    public async getData(ID: number): Promise<Array<any>> {
        //Predicate zusammenbauen
        var PredicateValues: Predicate = Predicate
            .create('ID_Group', '==', ID)
            .and('Type', '==', 0);

        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaItems')
            .where(PredicateValues)
            .expand('UploadPicture.ImageProperty, MediaItemFacets');

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query ausführen 
        var Result: QueryResult = await this.manager.executeQuery(query);

        //Funktionsergebnis
        return Promise.resolve(Result.results);
    }

    //Lädt alle Photo-Alben vom Server
    public async loadAlben(): Promise<Array<any>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaGroups')
            .where('Type', '==', 0);

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query ausführen 
        var Result: QueryResult = await this.manager.executeQuery(query);

        //Funktionsergebnis
        return Promise.resolve(Result.results);
    }
 
    //Löscht das Item aus der Datenbank
    public async deleteItem(ID: number): Promise<SaveResult> {
        //Ermitteln der Entity
        var entityDelete = this.manager.getEntityByKey('MediaItem', ID);
            
        //Entfernen des Items aus dem Manager
        entityDelete.entityAspect.setDeleted();

        //Speichern der Änderungen
        return this.manager.saveChanges();
    }
}

@autoinject()
export class PictureAdminServiceEdit extends ServiceModelAssignEdit {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt die Daten für ein einzelnes Media-Item
    //um dieses zu editieren
    public async getItem(ID: number): Promise<EditDataWithFatherModel> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('MediaItems')
            .where('ID', '==', ID);

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query ausführen
        var Result: Array<any> = this.manager.executeQueryLocally(query);

        //Funktionsergebnis zusammenstellen
        var ReturnValue: EditDataWithFatherModel;
        ReturnValue = new EditDataWithFatherModel();
        ReturnValue.editItem = Result[0];
        ReturnValue.fatherItem = Result[0].MediaGroup;
        return Promise.resolve(ReturnValue);      
    }

    //Ermittelt die Upload-Photos vom Server
    public async getUploadItems(): Promise<Array<any>> {
        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('UploadPictures')
            .where('Status', '==', 0)
            .expand('ImageProperty');
  
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Ausführen der Query
        var Result: QueryResult = await this.manager.executeQuery(query);

        //Funktionsergebnis
        return Promise.resolve(Result.results);
    }

    //Ermittelt die Kategorien
    public async getCategories(): Promise<Array<any>> {
        //Predicate zusammenbauen
        var PredicateCategories: Predicate = Predicate
            .create('Type', '==', 0)
            .or('Type', '==', 2);

        //Query zusammenbauen
        var query: EntityQuery = new EntityQuery()
            .from('FacetGroups')
            .where(PredicateCategories)
            .expand('Values');

        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query in einem Promise ausführen
        var Result: QueryResult = await this.manager.executeQuery(query);
 
        //Funktionsergebnis
        return Promise.resolve(Result.results);
    }

    //Ermittelt das Vater-Item
    public async getFather(ID: number):Promise<any> {
        //Query zusammenbauen
        var queryAlbum: EntityQuery = new EntityQuery()
            .from('MediaGroups')
            .where('ID', '==', ID);
 
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Query für die Kategorie ausführen 
        var Result: QueryResult = await this.manager.executeQuery(queryAlbum);

        //Funktionsergebnis
        return Promise.resolve(Result.results[0]);
    }
  
    //Erstellt eine neues Media-Item im Entity-Manager
    public async createNew(idFather: number): Promise<any> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Return-Value zusammenbauen
        var RetVal: any = this.manager.createEntity('MediaItem');
        RetVal.ID_Group = idFather;
        RetVal.Type = 0;
        RetVal.NameGerman = 'Nicht benoetigt';
        RetVal.NameEnglish = 'Not needed';

        //Funktionsergebnis
        return Promise.resolve(RetVal);
    }

    //Erstellt eine neue Zuweisung für einen Kategorie-Wert
    public async createNewAssignedCategory(item: any, idCategory: number): Promise<any> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Erstellen der Entität
        var AssignedCategory: any = this.manager.createEntity('MediaItemFacet');
        AssignedCategory.ID_MediaItem = item.ID;
        AssignedCategory.ID_FacetValue = idCategory;

        //Return-Value
        return Promise.resolve(AssignedCategory);
    }

    //Entfernt eine Zuweisung für einen Kategorie-Wert
    public async removeAssignedCategory(assignedCategoryItem: any): Promise<void> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Ermitteln der Entity
        var entityDelete = this.manager.getEntityByKey('MediaItemFacet', assignedCategoryItem.ID);

        //Entfernen des Items aus dem Manager
        entityDelete.entityAspect.setDeleted();
    }

    //Speichert die Änderungen auf dem Server
    public async saveChanges(): Promise<SaveResult> {
        return this.manager.saveChanges();
    }
}

autoinject()
export class PictureAdminServiceEditExtend extends ServiceModel {
    //C'tor
    constructor (emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Erstellt eine neue Image-Property
    public async createImageProperty(uploadPicture: any, rotate: number): Promise<any> {
        //Ermitteln des Entity-Manager
        await this.getEntityManager();

        //Erstellen der Entität
        var NewImageProperty: any = this.manager.createEntity('UploadPictureImageProperty', {ID: uploadPicture.ID});
        NewImageProperty.Rotate = rotate;
        uploadPicture.ImageProperty = NewImageProperty;

        //Return-Value
        return Promise.resolve(NewImageProperty);
    }
}
