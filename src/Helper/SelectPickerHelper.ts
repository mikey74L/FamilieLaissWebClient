export class SelectPickerListSingle {
    //Members
    values: Array<SelectPickerValueItem> = [];

    //C'tor
    constructor () {

    }

    //Hinzufügen eines Items
    public addValue (id: number, name: string, assigned: boolean): void {
        //Ein neues Value-Objekt erzeugen
        var newValue: SelectPickerValueItem = new SelectPickerValueItem(id, name, assigned, null);

        //Das Value-Objekt zur Liste der Werte hinzufügen
        this.values.push(newValue);
    }

    //Setzen des aktuellen Items
    public setValue (id: number): void {
        //Zurücksetzen des bisherigen Items
        for (var Value of this.values) {
            Value.assigned = false;
        }

        //Setzen des neuen Items
        for (var Value of this.values) {
            if (Value.id == id) {
                Value.assigned = true;
                break;
            }
        }
    }

    //Ermittelt das selektierte Item
    public getChangedValue (): SelectPickerValueItem | undefined {
        //Deklaration
        var AssignedValue: SelectPickerValueItem | undefined;

        //Ermitteln des selektierten Items
        for (var Value of this.values) {
            if (Value.assigned) {
                AssignedValue = Value;
            }
        }

        //Funktionsergebnis
        return AssignedValue;
    }
}

export class SelectPickerListMultiple {
    //Members
    groups: Array<SelectPickerGroupItem> = [];

    //C'tor
    constructor () {

    }

    //Fügt eine Gruppe hinzu
    public addGroup(id: number, name: string): SelectPickerGroupItem {
        //Ein neues Gruppen-Objekt erzeugen
        var GroupItem: SelectPickerGroupItem = new SelectPickerGroupItem(id, name);

        //Das Gruppen-Objekt zur Liste hinzufügen
        this.groups.push(GroupItem);

        //Das Gruppen-Objekt zurückliefern
        return GroupItem;
    }

    //Setzt alle Werte zurück
    public resetAll(): void {
        for (var Group of this.groups) {
            Group.resetAll();
        }
    }

    //Setzt den Assign-Status für ein Element
    public setValue(id: number): void {
        for (var Group of this.groups) {
            for (var Value of Group.values) {
                if (Value.id == id) {
                    Value.assigned = true;
                    break;
                }
            }
        }
    }

    //Ermittelt alle geänderten Values
    public getChangedValues(): Array<SelectPickerValueItem> {
        //Deklaration
        var changedItems: Array<SelectPickerValueItem> = [];

        //Ermitteln aller geänderten Values
        for (var Group of this.groups) {
            for (var Value of Group.values) {
                if (Value.assigned != Value.assignedOriginal) {
                    changedItems.push(Value);
                }
            }
        }

        //Funktionsergebnis
        return changedItems;
    }
}

export class SelectPickerGroupItem {
    //Members
    id: number;
    name: string;
    values: Array<SelectPickerValueItem> = [];

    //C'tor
    constructor (id: number, name: string) {
        //Übernehmen der Parameter
        this.id = id;
        this.name = name;
    }

    //Fügt einen Wert zur Gruppe hinzu
    public addValue(id: number, name: string, assigned: boolean, originalItem: any): void {
        //Ein neues Value-Objekt erzeugen
        var newValue: SelectPickerValueItem = new SelectPickerValueItem(id, name, assigned, originalItem);

        //Das Value-Objekt zur Liste der Werte hinzufügen
        this.values.push(newValue);
    }

    //Setzt alle Werte zurück
    public resetAll(): void {
        for (var Value of this.values) {
            Value.assigned = false;
        }
    }
}

export class SelectPickerValueItem {
    //Members
    id: number;
    name: string;
    assigned: boolean;
    assignedOriginal: boolean;
    originalItem: any;

    //C'tor
    constructor (id: number, name: string, assigned: boolean, originalItem: any) {
        //Übernehmen der Parameter
        this.id = id;
        this.name = name;
        this.assigned = assigned;
        this.assignedOriginal = assigned;
        this.originalItem = originalItem;
    }
}
