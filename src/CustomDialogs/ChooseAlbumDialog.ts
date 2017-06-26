/// <reference path="../../typings/globals/syncfusion/ej.web.all.d.ts" />
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewModelGeneralDialog } from '../Helper/ViewModelHelper';
import { DialogController } from 'aurelia-dialog';
import { ServiceModelAssign } from '../Helper/ServiceHelper';
import { ValidationController } from 'aurelia-validation';
import { ChooseAlbumDialogService } from './ChooseAlbumDialogService';
import { enMediaType } from '../Enum/FamilieLaissEnum';
import 'syncfusion-javascript/content/ej/web/ej.widgets.core.material.less';
import 'syncfusion-javascript/content/ej/web/material/ej.theme.less';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), DialogController, ChooseAlbumDialogService)
export class ChooseAlbumDialog extends ViewModelGeneralDialog {
    //Optionen für i18N
    locOptions = { ns: 'Dialogs' };

    //Members
    currentType: enMediaType;
    service: ChooseAlbumDialogService;
    entities: Array<any>;

    gridFilterSettings: ej.Grid.FilterSettings;
    gridSortSettings: ej.Grid.SortSettings;
    gridEditSettings: ej.Grid.EditSettings;
    gridSelectionSettings: ej.Grid.SelectionSettings;
    gridScrollSettings: ej.Grid.ScrollSettings;

    selectedAlbum: any;

    isOKEnabled: boolean;
    isItemSelected: boolean;

    //C'tor
    constructor (loc: I18N, eventAggregator: EventAggregator, validationController: ValidationController, dialogController: DialogController, service: ChooseAlbumDialogService) {
      //Aufrufen des Constructors der Vater-Klasse
      super(loc, eventAggregator, validationController, dialogController);

      //Übernehmen des Service
      this.service = service;

      //Setzen der Filteroptionen für das Grid
      this.gridFilterSettings = { filterType : "excel"};

      //Setzen der Sortier-Optionen für das Grid
      this.gridSortSettings = { sortedColumns: [{ field: "NameGerman", direction: "ascending" }]};

      //Setzen der Editier-Optionen für das Grid
      this.gridEditSettings = { allowEditing: false };

      //Setzen der Selection-Optionen für das Grid
      this.gridSelectionSettings = { selectionMode: ["row"] };

      //Setzen der Scroll-Settings für das Grid
      this.gridScrollSettings = { width: 800, height: 400 };
    }
    
    //Wird aufgerufen wenn eine Zeile i Grid selektiert wird
    public rowHasBeenSelected(args: ej.Grid.RowSelectedEventArgs): void {
        //Auswerten ob eine gültige Zeile selektiert wurde
        if (args.rowIndex != undefined && args.rowIndex >= 0) {
            //Setzen des Flags
            this.selectedAlbum = args.data;
            this.isItemSelected = true;
        }
        else {
          //Setzen des Flags
          this.isItemSelected = false;
        }

        //Buttom-Enabled State prüfen
        this.checkEnabledState();
    }

    //Wird von Aurelia aufgerufen wenn der Dialog angezeigt wird
    protected async activateChild(info: enMediaType): Promise<void> {
      //Übernehmen des Typs
      this.currentType = info;

      //Anzeigen der Busy-Box
      this.setBusyState(true);

      //Laden der entsprechenden Alben
      this.entities = await this.service.getData(this.currentType);

      //Ausblenden der Busy-Box
      this.setBusyState(false);
    }

    //Wird von Aurelia aufgerufen
    protected checkEnabledState(): void {
      //Wenn keine Items vorhanden sind, dann
      //ist auch der OK-Button gesperrt. Und nur wenn Elemente
      //vorhanden sind, und auch eines ausgewählt ist, dann
      //ist der OK-Button freigeschalten
      if (this.isBusy) {
        this.isOKEnabled = false;
      }
      else {  
        if (this.entities != null && this.entities.length == 0) {
          this.isOKEnabled = false;
        }
        else {
          if (this.isItemSelected) {
            this.isOKEnabled = true;
          }
          else {
            this.isOKEnabled = false;
          }
        }
      }
    }

    //Wird von Aurelia aufgerufen
    protected busyStateChanged(): void {

    }
}
