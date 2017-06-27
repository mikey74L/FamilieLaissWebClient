import { ViewModelGeneralDialog } from '../Helper/ViewModelHelper';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationController } from 'aurelia-validation';
import { DialogController } from 'aurelia-dialog';
import { ChooseAlbumDialogService } from './ChooseAlbumDialogService';
import { enMediaType } from '../Enum/FamilieLaissEnum';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), DialogController, ChooseAlbumDialogService)
export class ChooseAlbumDialog extends ViewModelGeneralDialog {
  //Optionen für i18N
  locOptions = { ns: 'Dialogs' };

  //Members
  currentType: enMediaType;
  service: ChooseAlbumDialogService;
  entities: Array<any>;

  //C'tor
  constructor (loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogController: DialogController, service: ChooseAlbumDialogService) {
    //Aufrufen des Constructors der Vater-Klasse
    super(loc, eventAggregator, validationController, dialogController);

    //Übernehmen des Service
    this.service = service;
  }

  //Wird von Aurelia aufgerufen wenn der Dialog angezeigt wird
  protected async activateChild(info: enMediaType): Promise<void> {
    //Übernehmen des Typs
    this.currentType = info;

    //Anzeigen der Busy-Box
    this.setBusyState(true);

    //Laden der entsprechenden Alben
    this.entities = await this.service.getDataOrderd(this.currentType);

    //Ausblenden der Busy-Box
    this.setBusyState(false);
  }

  //Wird von Aurelia aufgerufen
  protected checkEnabledState(): void {
  }

  //Wird von Aurelia aufgerufen
  protected busyStateChanged(): void {
  }
}
