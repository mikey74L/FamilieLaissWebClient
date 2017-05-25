import {bindable, customElement, containerless} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {autoinject} from 'aurelia-framework'; 
import {I18N} from 'aurelia-i18n';
import {DeletePictureEvent, ChoosePictureEvent, EditPictureEvent} from '../Events/PictureEvents';
import {PictureURLHelper} from '../Helper/PictureURLHelper';
import {ShowPictureBigArgs} from '../Models/ShowPictureBigArgs';
import {DialogService, DialogCloseResult} from 'aurelia-dialog';
import {ShowPictureBigDialog} from '../CustomDialogs/ShowPictureBigDialog';
import 'preload-js';
import 'fabric';
import '../../vendors/heartcode/heartcode-canvasloader.js';

declare var CanvasLoader;

@customElement('picture-control')
@containerless()
@autoinject()
export class PictureControl {
    //Optionen für i18N
    locConfig: any = { ns: 'Controls' };

    //Control-Properties
    URLHelper: PictureURLHelper;
    pictureItem: any;
    uploadItem: any;

    //Hier wird von außen das Objekt mit dem anzuzeigenden Bild übergeben
    @bindable() item: any;

    //Der Modus bestimmt aus welchem Kontext das Control angezeigt wird. Je nach Modus werden unterschiedliche
    //Controls und Informationen angezeigt
    //1 = Upload-Item aus der Liste der Upload-Items
    //2 = Auswahl eines Upload-Items beim Hinzufügen eines neuen Photos zu einem Album
    //3 = Liste der zugewiesenen Photos zu einem Album in der Liste für die Administration
    //4 = Anzeige eines Bildes ohne Zusatzinformationen (Upload-Item)
    //5 = Anzeihe eines Bildes ohne Zusatzinformationen (Media-Item)
    @bindable() modus: number;

    //Hier kann ein Prefix für doe IDs der HTML-Elemente übergeben werden
    //Wird dann gebraucht wenn auf einer Seite das Selbe Bild mit der gleichen ID
    //mehrmals angezeigt wird
    @bindable() prefix: string;

    //Hier kann ein zusätzlicher Rotationswert von außen übergeben werden
    @bindable() additionalRotation: number;

    //Dieser Callback wird aufgerufen bevor das Bild angezeigt wird (vor dem Download)
    @bindable() callbackBeforePictureShow: Function;

    //Dieser Callback wird aufgerufen nach dem das Bild angezeigt wurde 
    @bindable() callbackAfterPictureShow: Function;

    i18nContext: string;

    //Members
    loc: I18N;
    aggregator: EventAggregator;
    dialog: DialogService;

    //Die Queue, Stage und das Bitmap für CreateJS
    queue : createjs.LoadQueue;
    canvas: fabric.ICanvas;
    image: fabric.IImage;

    //Die Hilfselmente für das Handling des Bildes über CreateJS und Canvas
    spinner : any;
    idPlaceholderSpinner: string;
    idCanvas: string;
    showPlaceholder: boolean;
    downloadCompleted: boolean;
    downloadWithError: boolean;
    canvasWidth: number;
    canvasHeight: number;
    stageInitialized: boolean;

    //C'tor
    constructor(loc: I18N, eventAggregator: EventAggregator, urlHelper: PictureURLHelper, dialogService: DialogService) {
        //Übernehmen der Parameter
        this.loc = loc;
        this.aggregator = eventAggregator;
        this.dialog = dialogService;
        this.URLHelper = urlHelper;

        //Initialisieren
        this.modus = -1;
        this.item = null;
        this.showPlaceholder = true;
        this.downloadWithError = false;
        this.downloadCompleted = false;
        this.stageInitialized = false;

        //Die Queue für den Download des Bildes initialisieren
        this.queue = new createjs.LoadQueue(false);

        //Die Event-Handler für die Queue zuweisen
        this.queue.addEventListener ('complete', () => { this.onDownloadCompleted(); });
        this.queue.addEventListener ('error', () => { this.onDownloadError(); });
    }
  
    //Je nach Modus auftrennen des Items in seine Bestandteile
    private seperateItem(): void {
        switch (this.modus) {
            case 1:
                this.pictureItem = null;
                this.uploadItem = this.item;
                break;
            case 2:
                this.pictureItem = null;
                this.uploadItem = this.item;
                break;
            case 3:
                this.pictureItem = this.item;
                this.uploadItem = this.item.UploadPicture;
                break;
            case 4:
                this.pictureItem = null;
                this.uploadItem = this.item;
                break;
        }
    }

    //Hiermit werden die IDs der HTML-Elemente bestimmt
    private setIDForControls(): void {
      try {
        if (this.prefix != null) {
          this.idPlaceholderSpinner = 'id_PlaceholderSpinner_' + this.prefix + '_' + this.uploadItem.ID;
          this.idCanvas = 'id_Canvas_' + this.prefix + '_' + this.uploadItem.ID;
        } 
        else {
          this.idPlaceholderSpinner = 'id_PlaceholderSpinner_' + this.uploadItem.ID;
          this.idCanvas = 'id_Canvas_' + this.uploadItem.ID;
        } 
      }
      catch (ex) {
        this.idPlaceholderSpinner = 'ToBeSet';
        this.idCanvas = 'ToBeSet';
      }
    }

    //Wird von Aurelia aufgerufen wenn sich das Item durch das Binding geändert hat
    private itemChanged(): void {
        if (this.modus != -1 && this.item != null) {
            //Separieren des Items
            this.seperateItem();
        }

        //Setzen der ID
        this.setIDForControls();
    }

    //Wird von Aurelia aufgerufen wenn sich der Modus durch das Binding geändert hat
    private modusChanged(): void {
        switch(this.modus) {
            case 1:
                this.i18nContext = 'Upload';
                break;
            case 2:
                this.i18nContext = 'Upload';
                break;
            case 3:
                this.i18nContext = 'Album';
                break;
            case 4:
                this.i18nContext = 'Upload';
                break;
        }

        if (this.modus != -1 && this.item != null) {
            //Separieren des Items
            this.seperateItem();
        }

        //Setzen der ID
        this.setIDForControls();
    }

    //Wird von Aurelia aufgerufen wenn sich der Wert für den Prefix über das
    //Binding geändert hat
    private prefixChanged(): void {
      //Setzen der ID
      this.setIDForControls();
    }

    //Wird von Aurelia aufgerufen wenn sich der Wert für die zusätzliche Rotation
    //über das Binding geändert hat
    private additionalRotationChanged(): void {
      //Erst wenn das Bild vollständig heruntergeladen wurde, wird eine
      //neue Rotation erlaubt
      if (this.downloadCompleted && !this.downloadWithError) {
        //Callback aufrufen
        try {
          this.callbackBeforePictureShow();
        }
        catch (ex) {

        }

        //Löschen der Queue
        this.queue.removeAll();

        //Anzeigen des Spinners
        this.spinner.show();
        this.showPlaceholder = true;

        //Entfernen des aktuell angezeigten Bildes aus dem Canvas
        this.canvas.clear();

        //Laden des Bildes über die Queue
        this.queue.loadFile({id:"picture", src: this.getImageURL(this.additionalRotation)});
      }
    }

    //Ermittelt die Image-URL für das übergebene Image
    private getImageURL(additionalRotation?: number): string {
        //Return-Value
        return this.URLHelper.getImageURLUpload(this.uploadItem, additionalRotation);
    }

    //Zeigt das ausgewählte Photo in Großansicht an
    public async showPictureBig(): Promise<void> {
        try {     
           //Aufrufen des Aurelia-Dialoges zur Anzeige des Bildes
           //im Großformat
           var Result: DialogCloseResult = await this.dialog.open({viewModel: ShowPictureBigDialog, model: new ShowPictureBigArgs(1, this.uploadItem)})
                                                            .whenClosed((reason: DialogCloseResult) => { return reason;});
        }
        catch (ex) {
           //Dialog wurde abgebrochen. Ess muss nichts gemacht werden
        }
    }

    //Das Bild soll gelöscht werden. 
    public deletePicture(): void {
        //Feuern des entsprechenden Events
        switch (this.modus) {
            case 1:
                this.aggregator.publish(new DeletePictureEvent(this.uploadItem));
                break;
            case 3:
                this.aggregator.publish(new DeletePictureEvent(this.pictureItem));
                break;
        }
    }

    //Das Bild soll ausgewählt werden
    public choosePicture(): void {
        //Feuern des entsprechenden Events
        this.aggregator.publish(new ChoosePictureEvent(this.uploadItem));
    }

    //Das Bild soll editiert werden
    public editPicture(): void {
        //Feuern des entsprechenden Events
        switch (this.modus) {
            case 3:
                this.aggregator.publish(new EditPictureEvent(this.pictureItem));
                break;
        }
    }

    //Wird von Aurelia aufgerufen
    public attached(): void {
      //Callback aufrufen
      try {
        this.callbackBeforePictureShow();
      }
      catch (ex) {
        
      }

      //Wenn das Control zum DOM hinzugefügt wird, wird der Spinner angezeigt
      this.spinner = new CanvasLoader(this.idPlaceholderSpinner);
      this.spinner.setColor('#0f07ed'); 
      this.spinner.setShape('spiral'); 
      this.spinner.setDiameter(80); 
      this.spinner.setDensity(106); 
      this.spinner.setRange(0.8); 
      this.spinner.setSpeed(4); 
      this.spinner.show(); 

      //Wenn Control zum DOM hinzugefügt wird, dann wird der Download des
      //Bildes gestartet
      this.queue.loadFile({id:"picture", src: this.getImageURL()});
    }

    //Wird von Aurelia aufgerufen
    public detached(): void {
      //Wenn das Control vom DOM entfernt wird, dann werden die Event-Listener
      //deregistriert
      this.queue.removeAllEventListeners();
    }

    //Wird von der Queue aufgerufen wenn der Download des Bildes
    //erfolgreich abgeschlossen ist
    private onDownloadCompleted(): void {
        //Ausblenden des Spinners
        this.showPlaceholder = false;
        this.spinner.hide();

        //Wenn das Bild ohne Fehler heruntergeladen werden konnte, dann wird dieses
        //im Canvas angezeigt, ansonsten wird eine Fehlermeldung ausgegeben
        if (!this.downloadWithError) {
          //Das Hinzufügen des Bildes zum Canvas über einen Timeout entkoppeln
          //so dass Aurelia zeit hat den DOM anhand der "showPlaceholder" Property zu aktualisieren
          setTimeout(() => { this.showPictureAfterDownload(); }, 150);
        }
        else {
          setTimeout(() => { this.showErrorMessage(); }, 150);
        }
    }

    //Zeigt eine Fehlermeldung im Canvas an, dass das Bild nicht
    //heruntergeladen werden konnte
    private showErrorMessage(): void {
      //Initialisieren der Stage
      this.initializeStage();

      //Den Fehlertext für den Canvas erstellen
      var TextOptions: fabric.ITextOptions = {
        left: 0,
        top: 0,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: 'red'
      };
      var ErrorText: fabric.IText = new fabric.Text("Picture load error!!!", TextOptions);

      //Den Text zur Stage hinzufügen
      this.canvas.add(ErrorText);

      //Den Text zentrieren
      this.canvas.centerObject(ErrorText);

      //Den Canvas aktualisieren
      this.canvas.renderAll();
    }

    //Initialisiert die Stage für den Canvas
    private initializeStage(): void {
      if (!this.stageInitialized) {
        //Setzen der Width und Height Properties für den Canvas anhand der über CSS ermittelten
        //Höhe und Breite des Canvas. Dieses ist zwingend notwendig da sonst eine automatische
        //Skalierung im Canvas stattfindet
        this.canvasWidth = $("#" + this.idCanvas).width();
        this.canvasHeight = $("#" + this.idCanvas).height();
        $("#" + this.idCanvas).attr("width", this.canvasWidth);
        $("#" + this.idCanvas).attr("height", this.canvasHeight);

        //Initialisieren der Stage
        this.canvas = new fabric.Canvas(this.idCanvas);

        //Verdrahten des Event-Handlers für das Mouse-Up-Event auf dem Canvas
        this.canvas.on('mouse:up', (e: fabric.IEvent) => { this.onMouseUpCanvas(e); });

        //Setzen des Flags
        this.stageInitialized = true;
      }
    }

    //Wird aufgerufen wenn der Mouse-Button auf dem Canvas losgelassen wird
    private onMouseUpCanvas(e: fabric.IEvent): void {
        //Wenn der Download abgeschlossen ist, und erfolgreich war, dann
        //soll das Bild in Großansicht angezeigt werden
        if (this.downloadCompleted && !this.downloadWithError) {
          this.showPictureBig();
        }
    }

    //Wird aufgerufen wenn der Download eines Bilder abgeschlossen wurde
    private showPictureAfterDownload(): void {
        //Initialisieren der Stage
        this.initializeStage();

        //Hinzufügen des Bildes zum Canvas
        var ImageOptions: fabric.IObjectOptions;
        ImageOptions = {
          top: 0, 
          left: 0, 
          width: this.canvasWidth, 
          height: this.canvasHeight, 
          opacity: 0, 
          angle: 0,
          hasBorders : false,
          hasControls: false,
          hasRotatingPoint: false,
          selectable: false,
          hoverCursor: 'pointer'
        };
        this.image = new fabric.Image(<HTMLImageElement>(this.queue.getResult('picture')), ImageOptions);
        this.canvas.add(this.image);
    
        //Die Animation für das Einblenden des Bildes erstellen
        this.image.animate('opacity', 1, {duration: 1000, onChange: this.canvas.renderAll.bind(this.canvas)});

        //Download abgeschlossen
        this.downloadCompleted = true;

        //Aufrufen des Callback
        try {
          this.callbackAfterPictureShow();
        }
        catch (ex) {

        }
    }

    //Wird von der Queue aufgerufen wenn beim Download des Bildes
    //ein Fehler aufgetreten ist
    private onDownloadError(): void {
        //Setzen des Fehlerflags
        this.downloadWithError = true;
    }
}
