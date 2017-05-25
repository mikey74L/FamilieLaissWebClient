/// <reference path="../../typings/globals/syncfusion/ej.web.all.d.ts" />
import * as $ from 'jquery';
import { UploadFileInfo } from '../Models/UploadFileInfo';
import { UploadInProgressEvent } from './../Events/UploadControlEvents';
import { StorageService } from './../Service/StorageService';
import { enUploadType } from '../Enum/FamilieLaissEnum';
import { autoinject } from 'aurelia-dependency-injection';
import { Exception404, Exception500 } from './../Exception/UserException';
import { bindable, customElement, containerless } from 'aurelia-framework';
import swal from 'sweetalert2';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import { ToastrHelper } from './../Helper/ToastrHelper';
import { ExtractFilename, ExtractExtension } from '../Helper/HelperFunctions';
import 'syncfusion-javascript/content/ej/web/ej.widgets.core.material.less';
import 'syncfusion-javascript/content/ej/web/material/ej.theme.less';

@autoinject()
@customElement('upload-control')
@containerless()
export class UploadControl {
  //Deklaration für i18N
  public locConfig: any = { ns: ['Controls', 'translation'] };
  private loc: I18N;

  //Bindable Properties
  @bindable textUploadErrorHeader: string;
  @bindable textUploadErrorBody: string;
  @bindable textErrorConfirmButton: string;
  @bindable textUploadSuccessHeader: string;
  @bindable textUploadSuccessBody: string;
  @bindable textSuccessConfirmButton: string;
  @bindable uploadType: enUploadType;

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
  private evAggregator: EventAggregator;
  private toastrHelper: ToastrHelper;
  public fileList: Array<UploadFileInfo>;
  public isUploading: boolean;

  //Member für den Storage-Service
  private service: StorageService;

  //Deklarationen für den REST-Upload 
  private currentUploadID: number;
  private currentFilenameForUpload: string;
  private uploadWithErrors: boolean;
  private maxBlockSize: number = 512 * 1024; //Jede Datei wird in Chunks von 512K aufgeteilt
  private numberOfBlocks: number = 1;
  private currentFilePointer: number = 0;
  private totalBytesRemaining: number = 0;
  private blockIds: Array<string> = [];
  private blockIdPrefix: string = "block-";
  private submitUri: string = '';
  private bytesUploaded: number = 0;
  private uploadingFile: UploadFileInfo;
  private ReaderChuck: FileReader;

  //C'tor
  constructor(service: StorageService, loc: I18N, aggregator: EventAggregator, toastrHelper: ToastrHelper) {
    //Übernehmen der Parameter
    this.service = service;
    this.loc = loc;
    this.evAggregator = aggregator;
    this.toastrHelper = toastrHelper;

    //Erstellen des File-Readers
    this.ReaderChuck = new FileReader();
    this.ReaderChuck.onloadend = (evt: any) => {
      this.FilereaderChunkReaded(evt);
    }

    //Setzen der Editier-Optionen für das Grid
    this.gridEditSettings = { allowEditing: false };

    //Setzen der Selection-Optionen für das Grid
    this.gridSelectionSettings = { selectionMode: ["row"] };

    //Setzen der Scroll-Settings für das Grid
    this.gridScrollSettings = { width: '100%', height: 380 };

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
        MyUploadFile = new UploadFileInfo(this.loc, Item);

        //Das neue Objekt zur Liste hinzufügen
        this.fileList.push(MyUploadFile);
      }
      
      //Eine Kopie des Arrays erzeugen, so dass über das Binding das Grid aktualisiert wird
      this.refreshGrid();
  }
  
  //Wird vom Syncfusion Grid aufgerufen wenn die Column-Templates aktualisiert werden sollen
  private gridTemplateRefresh(args: ej.Grid.TemplateRefreshEventArgs) : void {
      //Initialisieren des Progess-Bars für das Template
      $(args.cell).find("#progressBarDone").ejProgressBar({value: args.data.percentageDone, height: "20"});
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
    var CountFilesForUpload: number = 0;

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
      }
      else {
        this.isDeleteEnabled = false;
      }
      if (this.fileList.length > 0) {
        this.isClearEnabled = true;
      }
      else {
        this.isClearEnabled = false;
      }

      for (var Item of this.fileList) {
        if (!Item.isUploaded) CountFilesForUpload += 1;
      }
      if (CountFilesForUpload > 0) {
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
    }

    //Aktualisieren des Grids
    this.isItemSelected = false;
    this.refreshGrid();
  }

  //Wird vom "Clear"-Button aufgerufen
  public clearList(): void {
    //Ein neues leeres Array erzeugen, was einem Leeren der Liste gleichkommt
    this.fileList = [];
    this.isItemSelected = false;

    //Enabled-Status der Buttons setzen
    this.refreshGrid();
  }

  //Initialiseren des Uploads für ein File
  //Setzen der Properties wie BlockSize, Filepointer, etc.
  private async uploadFile(): Promise<void> {
    try 
    {
      //Ermitteln der nächsten ID für das Upload-Item 
      this.currentUploadID = await this.service.getIDForUploadFromServer(this.uploadType);
      this.currentFilenameForUpload = this.currentUploadID.toString() + '.' + ExtractExtension(this.uploadingFile.fileName);

      //Status setzen
      this.uploadingFile.statusText = this.loc.tr('Uploadcontrol.Status.Upload', { ns: 'Controls' });
      this.refreshGrid();

      //Initialisierung der globalen Members für aktuelles File
      this.maxBlockSize = 512 * 1024;
      this.currentFilePointer = 0;
      this.totalBytesRemaining = 0;
      this.blockIds = [];

      //Ermitteln der Blockanzahl und der maximalen Größe der Blöcke
      var fileSize: number = this.uploadingFile.file.size;
      if (fileSize < this.maxBlockSize) {
        this.maxBlockSize = fileSize;
      }
      this.totalBytesRemaining = fileSize;
      if (fileSize % this.maxBlockSize == 0) {
        this.numberOfBlocks = fileSize / this.maxBlockSize;
      } 
      else {
        this.numberOfBlocks = parseInt((fileSize / this.maxBlockSize).toString(), 10) + 1;
      }

      //Aufrufen der Methode zum Start des eigentlichen Hochladens
      this.uploadOrCommit();
    }
    catch (ex)
    {
       //Es ist ein Fehler beim Schreiben des Chunks in Azure aufgetreten. Datei
       //wird als fehlerhafter Upload markiert und es wird mit der nächsten Datei fortgefahren
       this.uploadWithErrors = true;
       this.uploadingFile.statusText = this.loc.tr('Uploadcontrol.Status.Error', { ns: 'Controls' });;
       this.uploadingFile.percentageDone = 0;
       this.uploadingFile.withError = true;

       //Ausgeben eines Toasts
       this.toastrHelper.showNotifySuccess(this.loc.tr('UploadControl.Upload.Error', { ns: 'Toasts', 'filename' : this.uploadingFile.fileName }));

       //Aktualisieren des Grids
       this.refreshGrid();

       //Das nächste File ermitteln
       this.getNextFile();
    }
  }

  //Nächsten Chunk aus dem File auslesen oder die Block-Liste im
  //Azure-Storage speichern wenn die Datei komplett hochgeladen wurde
  private async uploadOrCommit(): Promise<void> {
    try {
      if (this.totalBytesRemaining > 0) {
        //Ermitteln des aktuellen Chunks
        var fileContent: Blob = this.uploadingFile.file.slice(this.currentFilePointer, this.currentFilePointer + this.maxBlockSize);
      
        //Bestimmen der aktuellen Block-ID und hinzufügen zum Array
        var blockId: string = this.blockIdPrefix + this.padForBlockID(this.blockIds.length, 6);
        this.blockIds.push(btoa(blockId));

        //Lesen des Chunks über den File-Reader. Dieser schreibt dann in seinem
        //Event-Handler die Daten über die REST-API in den Azure Storage
        this.ReaderChuck.readAsArrayBuffer(fileContent);

        //Ermitteln der aktuellen Bytes, Filepointers, etc für den hochgeladenen Chunck         
        this.currentFilePointer += this.maxBlockSize;
        this.totalBytesRemaining -= this.maxBlockSize;
        if (this.totalBytesRemaining < this.maxBlockSize) {
          this.maxBlockSize = this.totalBytesRemaining;
        }
      } 
      else {
        //Schreiben der Block-Liste wenn die Datei fertig hochgeladen wurde
        await this.commitBlockList();

        //Den Eintrag in der Azure-Queue machen die zur Weiterverarbeitung des Upload-Items über
        //den Web-Job führt
        await this.service.writeToUploadQueue(this.uploadType, this.currentUploadID, this.currentFilenameForUpload, 
                                              this.uploadingFile.fileName);

        //Setzen der Prozentzahl auf 100%
        this.uploadingFile.percentageDone = 100;
        this.uploadingFile.isUploaded = true;

        //Setzen des Status
        this.uploadingFile.statusText = this.loc.tr('Uploadcontrol.Status.Success', { ns: 'Controls' });
      
        //Ausgeben eines Toasts
        this.toastrHelper.showNotifySuccess(this.loc.tr('UploadControl.Upload.Success', { ns: 'Toasts', 'filename' : this.uploadingFile.fileName }));

        //Aktualisieren des Grids
        this.refreshGrid();

        //Ermitteln der nächsten Datei
        this.getNextFile();
      }
    }
    catch (ex)
    {
       //Es ist ein Fehler beim Schreiben des Chunks in Azure aufgetreten. Datei
       //wird als fehlerhafter Upload markiert und es wird mit der nächsten Datei fortgefahren
       this.uploadWithErrors = true;
       this.uploadingFile.statusText = this.loc.tr('Uploadcontrol.Status.Error', { ns: 'Controls' });;
       this.uploadingFile.percentageDone = 0;
       this.uploadingFile.withError = true;

       //Ausgeben eines Toasts
       this.toastrHelper.showNotifySuccess(this.loc.tr('UploadControl.Upload.Error', { ns: 'Toasts', 'filename' : this.uploadingFile.fileName }));

       //Aktualisieren des Grids
       this.refreshGrid();

       //Das nächste File ermitteln
       this.getNextFile();
    }
  }

  //Wird vom File-Reader aufgerufen wenn eine Datei hochgeladen wurde
  private async FilereaderChunkReaded(evt: any): Promise<void> {
    try {
      if (evt.target.readyState == 2) { // DONE == 2
        //Schreiben des ausgelesenen Chunks im Azure-Storage über den Service
        this.bytesUploaded += await this.service.submitBlock(this.uploadType, this.currentFilenameForUpload, 
                                                             this.blockIds, evt.target.result);

        //Ermitteln der Prozentzahl, wieviel schon hochgeladen wurde
        this.uploadingFile.percentageDone = parseFloat(((parseFloat(this.bytesUploaded.toString()) / 
                                                         parseFloat(this.uploadingFile.file.size.toString())) * 100).toFixed(2));
 
        //Einen Refresh für das Grid ausführen
        this.refreshGrid();

        //Den nächsten Chunck für das File ermitteln
        this.uploadOrCommit();
      }   
    }
    catch (ex)
    {
       //Es ist ein Fehler beim Schreiben des Chunks in Azure aufgetreten. Datei
       //wird als fehlerhafter Upload markiert und es wird mit der nächsten Datei fortgefahren
       this.uploadWithErrors = true;
       this.uploadingFile.statusText = this.loc.tr('Uploadcontrol.Status.Error', { ns: 'Controls' });;
       this.uploadingFile.percentageDone = 0;
       this.uploadingFile.withError = true;

       //Ausgeben eines Toasts
       this.toastrHelper.showNotifySuccess(this.loc.tr('UploadControl.Upload.Error', { ns: 'Toasts', 'filename' : this.uploadingFile.fileName }));

       //Aktualisieren des Grids
       this.refreshGrid();

       //Das nächste File ermitteln
       this.getNextFile();
    }
  }

  //Schreibt die Block-List in den Azure-Storage
  private commitBlockList(): Promise<void> {
    //Aufrufen der Methode im Service zum Schreiben der Block-List
    return this.service.commitBlockList(this.uploadType, this.currentFilenameForUpload, this.blockIds, 
      this.uploadingFile.file.type)
  }
  
  //Formatierung der Block-ID
  private padForBlockID(ID: number, length: number): string {
    //Deklaration
    var ReturnValue: string = '' + ID.toString();
    
    //Wenn die BlockID als String kleiner als die
    //geforderte Länge ist, dann wird mit führenden 0 aufgefüllt
    while (ReturnValue.length < length) {
      ReturnValue = '0' + ReturnValue;
    }
    
    //Funktionsergebnis
    return ReturnValue;
  }

  //Ermittelt das nächste Upload-File zum Hochladen
  public async getNextFile(): Promise<void> {
    //Deklaration
    var itemFound: boolean = false;

    //Suchen des nächsten Items
    for (var Item of this.fileList) {
      if (!Item.isUploaded && !Item.withError) {
        this.uploadingFile = Item;
        itemFound = true;
        break;
      }
    }

    //Wenn ein File gefunden wurde, dann wird dieses File hochgeladen
    if (itemFound) {
      this.uploadFile();
    }
    else {
      //Alle Items wurden hochgeladen der Upload ist beendet
      this.isUploading = false;

      //Zurücksetzen der SAS für den Upload, so dass beim
      //nächsten Upload wieder eine neue SAS angefordert wird
      this.service.resetSASForUploadItem();

      //Enabled-State der Buttons
      this.checkEnabledState();

      //Ausgeben der Meldungs-Box
      if (!this.uploadWithErrors) {
        await swal(
          {
             titleText: this.textUploadSuccessHeader,
             text: this.textUploadSuccessBody,
             type: 'success',
             width: 600,
             showCancelButton: false,
             confirmButtonText: this.textSuccessConfirmButton,
             allowOutsideClick: false,
             allowEscapeKey: true
          });}
      else {
        await swal(
          {
             titleText: this.textUploadErrorHeader,
             text: this.textUploadErrorBody,
             type: 'error',
             width: 600,
             showCancelButton: false,
             confirmButtonText: this.textErrorConfirmButton,
             allowOutsideClick: false,
             allowEscapeKey: true
          });
      }
             
      //Feuern des Events
      this.evAggregator.publish(new UploadInProgressEvent(false));
    }
  }

  //Wird vom "Upload"-Button aufgerufen
  public uploadFiles(): void {
    //Feuern des Events
    this.evAggregator.publish(new UploadInProgressEvent(true));

    //Setzen der Property für das aktive hochladen
    this.isUploading = true;
    this.uploadWithErrors = false;

    //Den Enabled-Status der Buttons setzen
    this.checkEnabledState();

    //Das nächste File zum Hochladen ermitteln
    this.getNextFile();
  }

  //Führt einen Refresh für das Grid aus
  private refreshGrid(): void {
    //Ein neues Array erzeugen. Durch das Binding des Grids
    //an das Array als Data-Source wird damit automatisch das Grid aktualisiert
    this.fileList = this.fileList.slice(0);

    //Den Enabled-State der Buttons steuern
    this.checkEnabledState();
  }
}
