/// <reference path="../../typings/globals/syncfusion/ej.web.all.d.ts" />
import { DropDownListConfig, DropdownListData, DropdownListControlData } from './../Helper/DropDownListHelper';
import { bindable, customElement, containerless } from 'aurelia-framework';

@customElement('drop-down-control')
export class DropDownControl {
  //Die ID für das HTML-ELement
  @bindable() id: string;
  
  //Property für die Breite des Controls nicht des Popups
  @bindable() width: number | string;

  //Die Properties zur Steuerung der Größe der Drop-Down-Liste
  @bindable() popupWidth: number;
  @bindable() popupHeight: number;
  @bindable() maxPopupWidth: number;
  @bindable() maxPopupHeight: number;
  @bindable() minPopupWidth: number;
  @bindable() minPopupHeight: number;
  @bindable() enablePopupResize: boolean;

  //Soll die Drop-Down-Liste mit Gruppenüberschriften angezeigt werden?
  @bindable() allowGrouping: boolean;

  //Der Platzhalter-Text für die Drop-Down-Liste
  @bindable() waterMarkText: string;

  //Signalisiert von außen ob das Control gesperrt werden muss
  @bindable() isEnabled: boolean;

  //Soll das Such-Eingabefeld angezeigt werden?
  @bindable() enableFilterSearch: boolean;

  //Bestimmt ob eine Mehrfachauswahl möglich sein soll
  @bindable() multipleSelectionAllowed: boolean;

  //Enthält die Daten für das Drop-Down-Control
  @bindable() data: DropdownListData;

  //Hält die aktuelle Instanz des Dropdown-Controls
  private dropdownControl: ej.DropDownList;

  //Die Konfigurationsdaten für das Drop-Down-Control
  private configData: DropDownListConfig;

  //Das aufbereitete Array mit Daten für das Control
  private dataForControl: Array<DropdownListControlData>;

  //C'tor
  constructor() {
    //Erstellen des Config-Objektes
    this.configData = new DropDownListConfig();
  }

  widthChanged(): void {
    this.configData.width = this.width;
  }

  popupWidthChanged(): void {
    this.configData.popupWidth = this.popupWidth;
  }

  popupHeightChanged(): void {
    this.configData.popupHeight = this.popupHeight;
  }

  maxPopupWidthChanged(): void {
    this.configData.maxPopupWidth = this.maxPopupWidth;
  }

  maxPopupHeightChanged(): void {
    this.configData.maxPopupHeight = this.maxPopupHeight;
  }

  minPopupWidthChanged(): void {
    this.configData.minPopupWidth = this.minPopupWidth;
  }

  minPopupHeightChanged(): void {
    this.configData.minPopupHeight = this.minPopupHeight;
  }

  allowGroupingChanged(): void {
    this.configData.allowGrouping = this.allowGrouping;
  }

  waterMarkTextChanged(): void {
    this.configData.waterMarkText = this.waterMarkText;
  }
  
  enableFilterSearchChanged(): void {
    this.configData.enableFilterSearch = this.enableFilterSearch;
  }

  multipleSelectionAllowedChanged(): void {
    if (this.multipleSelectionAllowed) {
      this.configData.showCheckbox = true;
      this.configData.multipleSelectMode = ej.MultiSelectMode.VisualMode;
    }
    else {
      this.configData.showCheckbox = false;
      this.configData.multipleSelectMode = ej.MultiSelectMode.None;
    }
  }

  dataChanged(): void {
    this.dataForControl = this.data.dataForControl;
  }

  isEnabledChanged(): void {
    try {
      if (this.isEnabled) {
        this.dropdownControl.enable();
      }
      else {
        this.dropdownControl.disable();
      }
    }
    catch (ex) {
    }
  }

  //Wird vom Syncfusion-Control aufgerufen sobald das Control initialisiert wurde
  dropdownCreated(): void {
    //Ermitteln des Controls
    this.dropdownControl = $('#' + this.id).data('ejDropDownList');

    // Setzen der initial zu selektierenden Items
    for (var Group of this.data.groups) {
      for (var Item of Group.values) {
        if (Item.assigned) {
          this.dropdownControl.selectItemByValue(Item.id);
        }
      }
    }
  }

  //Wird vom Syncfusion-Control aufgerufen sobald die Selektion geändert wurde
  madeSelection(e: any): void {
    //Deklaration
    var Args: ej.DropDownList.SelectEventArgs = e.detail;

    //Übernehmen des aktuellen Status
    if (this.multipleSelectionAllowed) {
      if (!Args.isChecked) {
        this.data.setValue(parseInt(Args.value), true);
      }
      else {
        this.data.setValue(parseInt(Args.value), false);
      }
    }
    else {
      this.data.setValue(parseInt(Args.value), true);
    }
  }
}