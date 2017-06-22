import { QueryBuilder } from './ODataQueryBuilder/query_builder';
import { Entity, EntityManager, Repository } from 'aurelia-orm';
import { LoadDataWithFatherModel, EditDataWithFatherModel } from '../Models/LoadDataWithFatherModel'
import { enEntityType } from '../Enum/FamilieLaissEnum';

export abstract class ServiceModel {
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
}

export abstract class ServiceModelLoadData extends ServiceModel {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<Entity>>;
}

export abstract class ServiceModelLoadDataDelete extends ServiceModelLoadData {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<Response>;
}

export abstract class ServiceModelStammdaten<T extends Entity> extends ServiceModel {
    //Members
    protected queryBuilder: QueryBuilder<T>;

    //C'tor
    constructor(manager: EntityManager) {
      //Aufrufen der Vater-Constructor
      super(manager);

      //Initialisieren des Query-Builder
      this.queryBuilder = new QueryBuilder<T>();
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

export abstract class ServiceModelStammdatenID<T extends Entity> extends ServiceModelStammdaten<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(ID: number): Promise<LoadDataWithFatherModel>;

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<Response>;
}

export abstract class ServiceModelStammdatenEdit<T extends Entity> extends ServiceModel {
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

export abstract class ServiceModelStammdatenEditID<T extends Entity> extends ServiceModelStammdatenEdit<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public abstract async getItem(ID: number, idFather: number): Promise<EditDataWithFatherModel>;

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract createNew(idFather: number): T;

    //Ermittelt das Vater-Item (Ist abstract und muss überschrieben werden)
    public abstract async getFather(idFather: number): Promise<Entity>;
}

export abstract class ServiceModelAssign extends ServiceModel {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(ID: number): Promise<Array<Entity>>;

    //Lädt die Alben (Ist abstract und muss überschrieben werden)
    public abstract async loadAlben(): Promise<Array<Entity>>;

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<Response>;
}

export abstract class ServiceModelAssignEdit<T extends Entity> extends ServiceModelStammdatenEdit<T> {
    //C'tor
    constructor(manager: EntityManager) {
      super(manager);
    }

    //Ermittelt das Item
    public abstract async getItem(ID: number): Promise<EditDataWithFatherModel>;

    //Ermittelt alle Upload-Items die noch nicht zugeordnet wurden
    public abstract async getUploadItems(): Promise<Array<Entity>>;

    //Ermittelt alle Kategorien die zugeordnet werden können
    public abstract async getCategories(): Promise<Array<Entity>>;

    //Ermittelt das Vater-Item
    public abstract async getFather(ID: number):Promise<Entity>;

    //Erzeugt ein neues Item
    public abstract createNew(idFather: number): Entity;

    //Erzeugt eine neue Zuweisung für einen Kategoriewert
    public abstract async createNewAssignedCategory(item: any, idCategory: number): Promise<Entity>;

    //Entfernt einen zugewießenen Kategoriewert
    public abstract async removeAssignedCategory(assignedCategoryItem: any): Promise<void>;
}
