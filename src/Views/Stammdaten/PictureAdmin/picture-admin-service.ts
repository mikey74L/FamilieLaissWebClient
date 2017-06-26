import { MediaItemFacet } from './../../../Models/Entities/MediaItemFacet';
import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { UploadPictureItem } from './../../../Models/Entities/UploadPictureItem';
import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from '../../../Helper/ServiceHelper'
import { autoinject } from 'aurelia-dependency-injection';
import { enEntityType } from '../../../Enum/FamilieLaissEnum';
import { ServiceModelAssign, ServiceModelAssignEdit } from '../../../Helper/ServiceHelper';
import { MediaItem } from '../../../Models/Entities/MediaItem';
import { MediaGroup } from '../../../Models/Entities/MediaGroup';
import { enMediaType, enFacetType, enUploadPictureStatus } from '../../../Enum/FamilieLaissEnum';
import { Expression } from '../../../Helper/ODataQueryBuilder/expression';

@autoinject()
export class PictureAdminService extends ServiceModelAssign<MediaItem, MediaGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.MediaItem);
      this.getRepositoryFather(enEntityType.MediaGroup);
    }

    //Lädt die Photos für das Album mit der angegebenen ID
    //vom Server
    public async getData(idFather: number): Promise<Array<MediaItem>> {
        //Query zusammenbauen
        let Query = this.getQueryBuilder<MediaItem>();
        Query.equals(x => x.ID_Group, idFather).equals(x => x.Type, enMediaType.Picture);

        //Ermitteln der Daten
        return this.repository.find(this.getQueryStringFromQuery<MediaItem>(Query));
    }

    //Lädt alle Photo-Alben vom Server
    public async loadAlben(): Promise<Array<MediaGroup>> {
        //Query zusammenbauen
        let Query = this.getQueryBuilder<MediaGroup>();
        Query.equals(x => x.Type, enMediaType.Picture);

        //Query ausführen
        return this.repositoryFather.find(this.getQueryStringFromQuery(Query));
    }
}

@autoinject()
export class PictureAdminServiceEdit extends ServiceModelAssignEdit<MediaItem, MediaGroup, UploadPictureItem, FacetGroup> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.MediaItem);
      this.getRepositoryFather(enEntityType.MediaGroup);
      this.getRepositoryCategory(enEntityType.FacetGroup);
      this.getRepositoryUpload(enEntityType.UploadPictureItem);
    }

    //Ermittelt die Upload-Photos vom Server
    public async getUploadItems(): Promise<Array<UploadPictureItem>> {
        //Query zusammenbauen
        let Query = this.getQueryBuilder<UploadPictureItem>();
        Query.equals(x => x.Status, enUploadPictureStatus.Uploaded);
  
        //Funktionsergebnis
        return this.repositoryUpload.find(this.getQueryStringFromQuery(Query));
    }

    //Ermittelt die Kategorien
    public async getCategories(): Promise<Array<FacetGroup>> {
        //Query zusammenbauen
        let Query = this.getQueryBuilder<FacetGroup>();
        let expression = Expression.or(Expression.equals<FacetGroup, enFacetType>(x => x.Type, enFacetType.Picture), 
                                       Expression.equals<FacetGroup, enFacetType>(x => x.Type, enFacetType.Both));
        Query.filter(expression);                                      

        //Funktionsergebnis
        return this.repositoryCategory.find(this.getQueryStringFromQuery(Query));
    }

    //Erstellt eine neues Media-Item im Entity-Manager
    public createNew(idFather: number): MediaItem {
        //Return-Value zusammenbauen
        var RetVal: MediaItem = this.repository.getNewEntity();
        RetVal.ID_Group = idFather;
        RetVal.Type = enMediaType.Picture;
        RetVal.NameGerman = 'Nicht benoetigt';
        RetVal.NameEnglish = 'Not needed';

        //Funktionsergebnis
        return RetVal;
    }

    //Erstellt eine neue Zuweisung für einen Kategorie-Wert
    public createNewAssignedCategory(id: number, idCategory: number): MediaItemFacet {
        //Erstellen der Entität
        let AssignedCategory: MediaItemFacet = this.reposi
        AssignedCategory.ID_MediaItem = id;
        AssignedCategory.ID_FacetValue = idCategory;

        //Return-Value
        return AssignedCategory;
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
    public async createImageProperty(uploadPicture: any, rotate: number): Promise<EntityBase> {
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
