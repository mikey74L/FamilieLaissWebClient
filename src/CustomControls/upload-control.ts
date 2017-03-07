/// <reference path="../../typings/globals/syncfusion/ej.web.all.d.ts" />
import * as $ from 'jquery';
import {UploadFileInfo} from '../Models/UploadFileInfo';

export class UploadControl {
  //Deklaration für i18N
  public locConfig: any = { ns: ['Controls', 'translation'] };

  //Member für das Grid
  public grid: ej.Grid;
  public gridEditSettings: ej.Grid.EditSettings;
  public gridSelectionSettings: ej.Grid.SelectionSettings;
  public gridScrollSettings: ej.Grid.ScrollSettings;
  private isItemSelected: boolean;
  private selectedItem: UploadFileInfo;

  //Sichtbarkeit der Buttons
  public isAddEnabled: boolean;
  public isDeleteEnabled: boolean;
  public isClearEnabled: boolean;
  public isStartUploadEnabled: boolean;

  //Deklaration für File-UploadControl
  public fileList: Array<UploadFileInfo>;
  public isUploading: boolean;

  //C'tor
  constructor() {
    //Setzen der Editier-Optionen für das Grid
    this.gridEditSettings = { allowEditing: false };

    //Setzen der Selection-Optionen für das Grid
    this.gridSelectionSettings = { selectionMode: ["row"] };

    //Setzen der Scroll-Settings für das Grid
    this.gridScrollSettings = { width: '100%', height: 400 };

    //Initialisieren der Members
    this.fileList = [];
    this.isItemSelected = false;
    this.isUploading = false;

    //Steuern der Button-Enabled
    this.checkEnabledState();
  }

  //Wird von Aurelia aufgerufen wenn das Control zum DOM hinzugefügt wird
  public attached(): void {
    //Ermitteln der Grid-Instanz
    setTimeout(() => {
      this.grid = $("#grid_Uploadlist").data("ejGrid");
    }, 500);
  }

  //Wird vom File-Control aufgerufen wenn Dateien ausgewählt wurden
  public filesSelected(args: any): void {
      //Deklaration
      var MyUploadFile: UploadFileInfo;

      //Ermitteln der Dateien
      var FileListTemp: Array<File> = args.currentTarget.files;
      
      //Durch alle Elemente durchgehen und diese zur bisherigen Liste hinzufügen
      for (var Item of FileListTemp) {
        //Ein neues Objekt erzeugen
        MyUploadFile = new UploadFileInfo(Item);

        //Das neue Objekt zur Liste hinzufügen
        this.fileList.push(MyUploadFile);
      }
      
      //Eine Kopie des Arrays erzeugen, so dass über das Binding das Grid aktualisiert wird
      this.fileList = this.fileList.slice(0);

      //Den Enabled-State der Buttons steuern
      this.checkEnabledState();
  }
  
  //Wird vom Grid aufgerufen wenn eine Zeile selektiert wurde
  private rowHasBeenSelected(args: ej.Grid.RowSelectedEventArgs): void {
    if (args.rowIndex != undefined && args.rowIndex >= 0) {
      //Die aktuelle Zeilenhöhe des Grids ermitteln
      var rowHeight: number = this.grid.getRowHeight();
            
      //Den Scroller für die Y-Achse des Grids auf den entsprechenden
      //Wert setzen, so dass die selektierte Zeile angezeigt wird
      try
      {
        var Scroller: ej.Scroller = this.grid.getScrollObject();
        var ScrollPosition: number = rowHeight * args.rowIndex;
        this.grid.getScrollObject().scrollY(ScrollPosition, true, 1);
      }
      catch (ex)
      {
        //Wenn hier eine Exception auftaucht dann ist der Scroller nicht initialisiert,
        //da das Grid aktuell keinen Braucht wegen der zu geringen Anzahl an Items
      }

      //Setzen des Flags
      this.selectedItem = args.data;
      this.isItemSelected = true;
    }
    else {
      //Setzen des Flags
      this.isItemSelected = false;
    }
  
    //Setzen des Enabled-State
    this.checkEnabledState();
  }

  //Steuert den Enabled-State der Buttons anhand der Selektion im Grid
  private checkEnabledState(): void {
    if (this.isUploading) {
      this.isAddEnabled = false;
      this.isClearEnabled = false;
      this.isDeleteEnabled = false;
      this.isStartUploadEnabled = false;
    }
    else {
      this.isAddEnabled = true;
      if (this.isItemSelected) {
        this.isDeleteEnabled = true;
        this.isClearEnabled = true;
      }
      else {
        this.isDeleteEnabled = false;
        this.isClearEnabled = false;
      }
      if (this.fileList.length > 0) {
        this.isStartUploadEnabled = true;
      }
      else {
        this.isStartUploadEnabled = false;
      }
    }
  }

  //Wird vom "Add"-Button aufgerufen
  public addFile(): void {
    //Es muss ein Click-Event für das File-Control durchgeführt werden,
    //so dass die entsprechende Datei-Auswahl angezeigt wird
    $("#fileInput").click();
  }

  //Wird vom "Delete"-Button aufgerufen
  public deleteFile(): void {
    //Ermitteln des Index des selektierten Items
    var Ind: number = this.fileList.indexOf(this.selectedItem);

    //Entfernen des Eintrages aus dem Array
    if (Ind > -1) {
      this.fileList.splice(Ind, 1);
      this.fileList = this.fileList.slice(0);
    }

    //Aktualisieren des Enabled-Status der Buttons
    this.isItemSelected = false;
    this.checkEnabledState();
  }

  //Wird vom "Clear"-Button aufgerufen
  public clearList(): void {
    //Ein neues leeres Array erzeugen, was einem Leeren der Liste gleichkommt
    this.fileList = [];
    this.isItemSelected = false;

    //Enabled-Status der Buttons setzen
    this.checkEnabledState();
  }

  //Wird vom "Upload"-Button aufgerufen
  public uploadFiles(): void {

  }
}
