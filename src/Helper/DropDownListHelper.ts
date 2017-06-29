/// <reference path="../../typings/globals/syncfusion/ej.web.all.d.ts" /> 
 
export class DropDownListConfig { 
    public showCheckbox: boolean; 
    public multipleSelectMode: ej.MultiSelectMode; 
 
    public allowGrouping: boolean; 
    public waterMarkText: string; 
     
    public width: number | string; 
    public popupWidth: number; 
    public popupHeight: number; 
    public maxPopupWidth: number; 
    public maxPopupHeight: number; 
    public minPopupWidth: number; 
    public minPopupHeight: number; 
    public enablePopupResize: boolean; 
 
    public enableFilterSearch: boolean; 
 
    //C'tor 
    constructor () { 
      //Initialisieren der Properties 
      this.width = '100%'; 
      this.showCheckbox = false; 
      this.multipleSelectMode = ej.MultiSelectMode.None; 
      this.waterMarkText = ''; 
      this.allowGrouping = false; 
      this.popupWidth = 700; 
      this.popupHeight = 300; 
      this.minPopupWidth = 500; 
      this.minPopupHeight = 100; 
      this.maxPopupWidth = 900; 
      this.maxPopupHeight = 500; 
      this.enablePopupResize = true; 
      this.enableFilterSearch = false; 
    } 
 
    get fields(): ej.DropDownList.Fields { 
      if (this.allowGrouping) { 
        return {groupBy: 'groupName', text: 'text', value: 'id'} 
      } 
      else { 
        return {text: 'text', value: 'id'} 
      } 
    } 
} 

export class DropdownListData {
    //Members
    useMultipleValues: boolean;
    groups: Array<DropdownListGroupItem> = [];

    //C'tor
    constructor (useMultipleValues: boolean) {
      this.useMultipleValues = useMultipleValues;
    }

    //Fügt eine Gruppe hinzu
    public addGroup(id: number | string, name: string): DropdownListGroupItem {
        //Ein neues Gruppen-Objekt erzeugen
        var GroupItem: DropdownListGroupItem = new DropdownListGroupItem(id, name);

        //Das Gruppen-Objekt zur Liste hinzufügen
        this.groups.push(GroupItem);

        //Das Gruppen-Objekt zurückliefern
        return GroupItem;
    }

    //Setzt alle Werte zurück
    private resetAll(): void {
        for (var Group of this.groups) {
            Group.resetAll();
        }
    }

    //Setzt den Assign-Status für ein Element
    public setValue(id: number | string, value: boolean): void {
        //Wenn es sich um eine Liste für einen Single-Wert handelt werden
        //zuvor alle Werte zurückgesetzt
        if (!this.useMultipleValues) {
          this.resetAll();
        }

        //Setzen des Wertes für das entsprechende Item
        for (var Group of this.groups) {
            for (var Value of Group.values) {
                if (Value.id == id) {
                    Value.assigned = value;
                    break;
                }
            }
        }
    }

    //Ermittelt alle geänderten Values
    public getChangedValues(): Array<DropdownListValueItem> {
        //Deklaration
        var changedItems: Array<DropdownListValueItem> = [];

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

    get dataForControl() : Array<DropdownListControlData> {
      //Deklaration
      var returnValue: Array<DropdownListControlData> = [];

      //Durch alle Gruppen durchgehen und die
      //entsprechenden Values mit Ihren Gruppen-Namen zurückliefern
      for (var Group of this.groups) {
        for (var Value of Group.values) {
          returnValue.push (new DropdownListControlData(Value.id, Value.name, Group.name));
        }
      }

      //Funktionsergebnis
      return returnValue;
    }
}

export class DropdownListGroupItem {
    //Members
    id: number | string;
    name: string;
    values: Array<DropdownListValueItem> = [];

    //C'tor
    constructor (id: number | string, name: string) {
        //Übernehmen der Parameter
        this.id = id;
        this.name = name;
    }

    //Fügt einen Wert zur Gruppe hinzu
    public addValue(id: number | string, name: string, assigned: boolean, originalItem: any): void {
        //Ein neues Value-Objekt erzeugen
        var newValue: DropdownListValueItem = new DropdownListValueItem(id, name, assigned, originalItem);

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

export class DropdownListValueItem {
    //Members
    id: number | string;
    name: string;
    assigned: boolean;
    assignedOriginal: boolean;
    originalItem: any;

    //C'tor
    constructor (id: number | string, name: string, assigned: boolean, originalItem: any) {
        //Übernehmen der Parameter
        this.id = id;
        this.name = name;
        this.assigned = assigned;
        this.assignedOriginal = assigned;
        this.originalItem = originalItem;
    }
}

export class DropdownListControlData {
  public id: string | number;
  public text: string;
  public groupName: string;

  constructor (id: string | number, text: string, groupName: string) {
    this.id = id;
    this.text = text;
    this.groupName = groupName;
  }
}
