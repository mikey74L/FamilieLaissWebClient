import { EntityBase } from './../Models/Entities/EntityBase';
import { EntityManagerFactory } from './EntityManagerFactory';
import { LoadDataWithFatherModel, EditDataWithFatherModel } from '../Models/LoadDataWithFatherModel'
import {EntityManager, SaveResult} from 'breeze-client';

export abstract class ServiceModel {
    //Members
    protected emFactory: EntityManagerFactory;
    protected manager: EntityManager;

    //C'tor
    constructor(emFactory: EntityManagerFactory) {
        //Übernehmen der Parameter
        this.emFactory = emFactory;
    }
    
    //Ermitteln des Entity-Managers
    public async getEntityManager(): Promise<EntityManager>
    {
        // //Entity-Manager aus der Factory generieren
        this.manager = await this.emFactory.getEntityManager(false);

        //Funktionsergebnis
        return Promise.resolve(this.manager);
    }

    //Ist der Entity-Manager in einem Dirty-State
    public hasChanges(): boolean {
        return this.manager.hasChanges();
    }

    //Die Änderungen im Entity-Manager verwerfen
    public rejectChanges(): void {
        //Die Änderungen des Edit-Managers verwerfen
        this.manager.rejectChanges();
    }
}

export abstract class ServiceModelLoadData extends ServiceModel {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<EntityBase>>;
}

export abstract class ServiceModelLoadDataDelete extends ServiceModelLoadData {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<SaveResult>;
}

export abstract class ServiceModelStammdaten extends ServiceModel {
    //Members
    protected loadedFromServer: boolean = false;

    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<SaveResult>;
}

export abstract class ServiceModelStammdatenNormal extends ServiceModelStammdaten {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<EntityBase>>;

    //Refresh Data from Server (Ist abstract und muss überschrieben werden)
    public abstract async refreshData(): Promise<Array<EntityBase>>;
}

export abstract class ServiceModelStammdatenID extends ServiceModelStammdaten {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(ID: number): Promise<LoadDataWithFatherModel>;

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<SaveResult>;

    //Refresh Data from Server (Ist abstract und muss überschrieben werden)
    public abstract async refreshData(ID: number): Promise<LoadDataWithFatherModel>;
}

export abstract class ServiceModelStammdatenEdit extends ServiceModel {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Speichern der Änderungen auf dem Server (Ist abstract und muss überschrieben werden)
    public abstract async saveChanges(): Promise<SaveResult>;
}

export abstract class ServiceModelStammdatenEditNormal extends ServiceModelStammdatenEdit {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public abstract async getItem(ID: number): Promise<EntityBase>;

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract async createNew(): Promise<EntityBase>;
}

export abstract class ServiceModelStammdatenEditID extends ServiceModelStammdatenEdit {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public abstract async getItem(ID: number, idFather: number): Promise<EditDataWithFatherModel>;

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract async createNew(idFather: number): Promise<EntityBase>;

    //Ermittelt das Vater-Item (Ist abstract und muss überschrieben werden)
    public abstract async getFather(idFather: number): Promise<EntityBase>;
}

export abstract class ServiceModelAssign extends ServiceModel {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(ID: number): Promise<Array<EntityBase>>;

    //Lädt die Alben (Ist abstract und muss überschrieben werden)
    public abstract async loadAlben(): Promise<Array<EntityBase>>;

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<SaveResult>;
}

export abstract class ServiceModelAssignEdit extends ServiceModelStammdatenEdit {
    //C'tor
    constructor(emFactory: EntityManagerFactory) {
      super(emFactory);
    }

    //Ermittelt das Item
    public abstract async getItem(ID: number): Promise<EditDataWithFatherModel>;

    //Ermittelt alle Upload-Items die noch nicht zugeordnet wurden
    public abstract async getUploadItems(): Promise<Array<EntityBase>>;

    //Ermittelt alle Kategorien die zugeordnet werden können
    public abstract async getCategories(): Promise<Array<EntityBase>>;

    //Ermittelt das Vater-Item
    public abstract async getFather(ID: number):Promise<EntityBase>;

    //Erzeugt ein neues Item
    public abstract async createNew(idFather: number): Promise<EntityBase>;

    //Erzeugt eine neue Zuweisung für einen Kategoriewert
    public abstract async createNewAssignedCategory(item: any, idCategory: number): Promise<EntityBase>;

    //Entfernt einen zugewießenen Kategoriewert
    public abstract async removeAssignedCategory(assignedCategoryItem: any): Promise<void>;
}
