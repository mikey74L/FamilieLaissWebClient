import {ViewModelGeneralDialog} from '../Helper/ViewModelHelper';
import {ServiceModelAssignEdit} from '../Helper/ServiceHelper';
import {ChoosePictureEvent} from '../Events/PictureEvents';
import {DialogController} from 'aurelia-dialog';
import {inject, NewInstance } from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import { ValidationController } from 'aurelia-validation';
import { ChooseUploadPictureDialogService } from './ChooseUploadPictureDialogService';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), DialogController, ChooseUploadPictureDialogService)
export class ChooseUploadPictureDialog extends ViewModelGeneralDialog {
    //Localize Options für i18N
    locOptions: any = {ns: ['Dialogs', 'translation']};

    //Members
    entities: Array<any>;
    service: ChooseUploadPictureDialogService;

    subscribeChoosePicture: Subscription;

    //C'tor
    constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogController: DialogController, service: ChooseUploadPictureDialogService) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, validationController, dialogController);

        //Übernehmen des Service
        this.service = service;

        //Registrieren für das "Choose-Picture-Dialog"
        this.subscribeChoosePicture = this.eventAggregator.subscribe(ChoosePictureEvent, (message: ChoosePictureEvent) => {
            //Aufrufen der Methode zum Löschen des Bildes
            this.choosePicture(message.item);
        });
    }
 
    //Wird von Aurelia aufgerufen wenn der Dialog
    //aktiviert (angezeigt wird)
    protected async activateChild(info: any): Promise<void> {
        //Anzeigen der Busy-Box
        this.setBusyState(true);

        //Laden der Upload-Items
        this.entities = await this.service.getData();
    }

    //Wird von Aurelia aufgerufen wenn die View zum DOM hinzugefügt wird
    public attached(): void {
        //Ausblenden der Busy-Box
        this.setBusyState(false);
    }

    //Wird von Aurelia aufgerufen
    public detached(): void {
        //Deregistrieren der Events beim Event-Aggregator
        this.subscribeChoosePicture.dispose();
    }

    //Wird aufgerufen wenn ein Bild ausgewählt wird
    private choosePicture(choosedItem): void {
        //Den Dialog schließen und das ausgewählte Bild übergeben
        this.controller.ok(choosedItem);
    }

    //Wird von Aurelia aufgerufen
    protected busyStateChanged(): void {

    }
    
    //Wird von Aurelia aufgerufen
    protected checkEnabledState(): void {
    }
}
