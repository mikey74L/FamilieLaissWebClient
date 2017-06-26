import { QueryBuilder } from './ODataQueryBuilder/query_builder';
import { Entity, EntityManager, Repository } from 'aurelia-orm';
import { LoadDataWithFatherModel, EditDataWithFatherModel } from '../Models/LoadDataWithFatherModel'
import { enEntityType } from '../Enum/FamilieLaissEnum';

export abstract class ServiceModel<T> {
    //Members
    protected entityManager: EntityManager;
    protected repository: Repository;

    //C'tor
    constructor(manager: EntityManager) {
       //Übernehmen der Parameter
       this.entityManager = manager;
    }
    
    //Ermitteln des richtigen Repositories
    public getRepository(identifier: enEntityType): void
    {
        this.repository = this.entityManager.getRepository(identifier);
    }

    //Ermitteln eines neuen Query-Builders
    public getQueryBuilder<Q>(): QueryBuilder<Q> {
       return new QueryBuilder<Q>();
    }

    //Ermittelt den Filter-String für eine OData-Abfrage aus einer Query
    public getQueryStringFromQuery<Q>(query: QueryBuilder<Q>): string {
       return '?$filter=' + query.toQuery().$filter;
    }
}

export abstract class ServiceModelLoadData<T> extends ServiceModel<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<Entity>>;
}

export abstract class ServiceModelLoadDataDelete<T> extends ServiceModelLoadData<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ein Item muss gelöscht werden
    public async deleteItem(ID: number): Promise<Response> {
      //Ermitteln des Items
      let EntityToDelete: Entity = await this.repository.findOne(ID);

      //Löschen des Items
      return EntityToDelete.destroy();
    }
}

export abstract class ServiceModelStammdaten<T extends Entity> extends ServiceModel<T> {

    //C'tor
    constructor(manager: EntityManager) {
      //Aufrufen der Vater-Constructor
      super(manager);
    }

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public async deleteItem(ID: number): Promise<Response> {
        //Ermitteln der Entity
        var entityDelete: Entity = await this.repository.findOne(ID);
            
        //Speichern der Änderungen
        return entityDelete.destroy();
    }
}

export abstract class ServiceModelStammdatenNormal<T extends Entity> extends ServiceModelStammdaten<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<T>>;
}

export abstract class ServiceModelStammdatenID<T extends Entity, F extends Entity> extends ServiceModelStammdaten<T> {
    //Members
    protected repositoryFather: Repository;

    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryFather(identifier: enEntityType): void
    {
        this.repositoryFather = this.entityManager.getRepository(identifier);
    }

    //Ermittelt alle Items für den gegebenen Vater (Ist abstract und muss überschrieben werden)
    public abstract async getData(idFather: number): Promise<Array<T>>;

    //Ermittelt die Daten des Vaters
    public async getDataFather(idFather: number): Promise<F> {
      //Ermitteln der Daten des Vaters
      return this.repositoryFather.findOne(idFather);
    }
}

export abstract class ServiceModelStammdatenEdit<T extends Entity> extends ServiceModel<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }
}

export abstract class ServiceModelStammdatenEditNormal<T extends Entity> extends ServiceModelStammdatenEdit<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public async getItem(ID: number): Promise<T> {
        //Promise zurückliefern
        return this.repository.findOne(ID);
    }

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract createNew(): T;
}

export abstract class ServiceModelStammdatenEditID<T extends Entity, F extends Entity> extends ServiceModelStammdatenEdit<T> {
    //Members
    protected repositoryFather: Repository;

    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryFather(identifier: enEntityType): void
    {
        this.repositoryFather = this.entityManager.getRepository(identifier);
    }

    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public async getItem(ID: number): Promise<T> {
      //Daten für das Item ermitteln
      return this.repository.findOne(ID);
    }

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract createNew(idFather: number): T;

    //Ermittelt das Vater-Item (Ist abstract und muss überschrieben werden)
    public async getFather(idFather: number): Promise<F> {
        //Daten für den Vater ermitteln
        return this.repositoryFather.findOne(idFather);
    }
}

export abstract class ServiceModelAssign<T extends Entity, F extends Entity> extends ServiceModel<T> {
    //Members
    protected repositoryFather: Repository;

    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryFather(identifier: enEntityType): void
    {
        this.repositoryFather = this.entityManager.getRepository(identifier);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(idFather: number): Promise<Array<T>>;

    //Lädt die Alben (Ist abstract und muss überschrieben werden)
    public abstract async loadAlben(): Promise<Array<F>>;

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public async deleteItem(ID: number): Promise<Response> {
      //Ermitteln des Items
      let ItemToDelete: Entity = await this.repository.findOne(ID);

      //Item löschen
      return ItemToDelete.destroy();
    }
}

export abstract class ServiceModelAssignEdit<T extends Entity, Father extends Entity, Upload extends Entity, Category extends Entity, Assign extends Entity> extends ServiceModelStammdatenEdit<T> {
    //Members
    protected repositoryFather: Repository;
    protected repositoryUpload: Repository;
    protected repositoryCategory: Repository;
    protected repositoryAssigned: Repository;

    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryFather(identifier: enEntityType): void
    {
        this.repositoryFather = this.entityManager.getRepository(identifier);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryUpload(identifier: enEntityType): void
    {
        this.repositoryUpload = this.entityManager.getRepository(identifier);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryCategory(identifier: enEntityType): void
    {
        this.repositoryCategory = this.entityManager.getRepository(identifier);
    }

    //Ermitteln des richtigen Repositories
    public getRepositoryAssigned(identifier: enEntityType): void
    {
        this.repositoryAssigned = this.entityManager.getRepository(identifier);
    }

    //Ermittelt das Item
    public async getItem(ID: number): Promise<T> {
      //Laden der Daten
      return this.repository.findOne(ID);
    }

    //Ermittelt alle Upload-Items die noch nicht zugeordnet wurden
    public abstract async getUploadItems(): Promise<Array<Upload>>;

    //Ermittelt alle Kategorien die zugeordnet werden können
    public abstract async getCategories(): Promise<Array<Category>>;

    //Ermittelt das Vater-Item
    public async getFather(ID: number):Promise<Father> {
      //Laden der Daten
      return this.repositoryFather.findOne(ID);
    }

    //Erzeugt ein neues Item
    public abstract createNew(idFather: number): T;

    //Erzeugt eine neue Zuweisung für einen Kategoriewert
    public abstract createNewAssignedCategory (idMediaItem: number, idCategory: number): Assign;

    //Entfernt einen zugewießenen Kategoriewert
    public abstract async removeAssignedCategory(idAssignment: number): Promise<Response>;
}
