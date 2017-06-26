import { UploadPictureImageProperty } from './../../../Models/Entities/UploadPictureImageProperty';
import { MediaItemFacet } from './../../../Models/Entities/MediaItemFacet';
import { FacetGroup } from './../../../Models/Entities/FacetGroup';
import { UploadPictureItem } from './../../../Models/Entities/UploadPictureItem';
import { EntityManager, Entity, Repository } from 'aurelia-orm';
import { ServiceModel, ServiceModelStammdatenNormal, ServiceModelStammdatenEditNormal } from '../../../Helper/ServiceHelper'
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
export class PictureAdminServiceEdit extends ServiceModelAssignEdit<MediaItem, MediaGroup, UploadPictureItem, FacetGroup, MediaItemFacet> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.MediaItem);
      this.getRepositoryFather(enEntityType.MediaGroup);
      this.getRepositoryCategory(enEntityType.FacetGroup);
      this.getRepositoryUpload(enEntityType.UploadPictureItem);
      this.getRepositoryAssigned(enEntityType.MediaItemFacet);
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
    public createNewAssignedCategory(idMediaItem: number, idFacetValue: number): MediaItemFacet {
        //Erstellen der Entität
        let AssignedCategory: MediaItemFacet = this.repositoryAssigned.getNewEntity();

        //Zuweisen der Properties
        AssignedCategory.ID_MediaItem = idMediaItem;
        AssignedCategory.ID_FacetValue = idFacetValue;

        //Return-Value
        return AssignedCategory;
    }

    //Entfernt eine Zuweisung für einen Kategorie-Wert
    public async removeAssignedCategory(idFacetValue: number): Promise<Response> {
        //Query zusammenbauen
        let Query = this.getQueryBuilder<MediaItemFacet>();
        Query.equals(x => x.ID_FacetValue, idFacetValue);

        //Ermitteln der Entity
        var entityDelete: MediaItemFacet = await this.repositoryAssigned.findOne(this.getQueryStringFromQuery(Query));

        //Entfernen des Items aus dem Manager
        return entityDelete.destroy();
    }
}

@autoinject()
export class PictureAdminServiceEditExtend extends ServiceModel<UploadPictureImageProperty> {
    //C'tor
    constructor (manager: EntityManager) {
      //Aufrufen des Vater Constructor
      super(manager);

      //Repository erstellen
      this.getRepository(enEntityType.UploadPictureImageProperty);
    }

    //Erstellt eine neue Image-Property
    public createImageProperty(uploadPicture: UploadPictureItem, rotate: number): UploadPictureImageProperty {
        //Erstellen der Entität
        let Result: UploadPictureImageProperty = this.repository.getNewEntity();

        //Zuweisen der Properties
        Result.Rotate = rotate;
        Result.ID = uploadPicture.ID;

        //Return-Value
        return Result;
    }
}
