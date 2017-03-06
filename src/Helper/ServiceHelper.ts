import { EntityManagerFactory } from './EntityManagerFactory';
import { LoadDataWithFatherModel, EditDataWithFatherModel } from '../Models/LoadDataWithFatherModel'
import {EntityManager, SaveResult} from 'breeze-client';
import {autoinject} from 'aurelia-dependency-injection';

@autoinject(EntityManagerFactory)
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
        //Entity-Manager aus der Factory generieren
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
    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<any>>;
}

export abstract class ServiceModelLoadDataDelete extends ServiceModelLoadData {
    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<void>;
}

export abstract class ServiceModelStammdaten extends ServiceModel {
    //Members
    protected loadedFromServer: boolean = false;

    //Ein Item muss gelöscht werden (Ist abstract und muss überschrieben werden)
    public abstract async deleteItem(ID: number): Promise<SaveResult>;
}

export abstract class ServiceModelStammdatenNormal extends ServiceModelStammdaten {
    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(): Promise<Array<any>>;

    //Refresh Data from Server (Ist abstract und muss überschrieben werden)
    public abstract async refreshData(): Promise<Array<any>>;
}

export abstract class ServiceModelStammdatenID extends ServiceModelStammdaten {
    //Ermittelt alle Items (Ist abstract und muss überschrieben werden)
    public abstract async getData(ID: number): Promise<LoadDataWithFatherModel>;

    //Refresh Data from Server (Ist abstract und muss überschrieben werden)
    public abstract async refreshData(ID: number): Promise<LoadDataWithFatherModel>;
}

export abstract class ServiceModelStammdatenEdit extends ServiceModel {
    //Speichern der Änderungen auf dem Server (Ist abstract und muss überschrieben werden)
    public abstract async saveChanges(): Promise<SaveResult>;
}

export abstract class ServiceModelStammdatenEditNormal extends ServiceModelStammdatenEdit {
    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public abstract async getItem(ID: number): Promise<any>;

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract async createNew(): Promise<any>;
}

export abstract class ServiceModelStammdatenEditID extends ServiceModelStammdatenEdit {
    //Ermittelt die Daten zu einem bestimmten Item (Ist abstract und muss überschrieben werden)
    public abstract async getItem(ID: number, idFather: number): Promise<EditDataWithFatherModel>;

    //Ein neues Item (Ist abstract und muss überschrieben werden)
    public abstract async createNew(idFather: number): Promise<any>;

    //Ermittelt das Vater-Item (Ist abstract und muss überschrieben werden)
    public abstract async getFather(idFather: number): Promise<any>;
}
