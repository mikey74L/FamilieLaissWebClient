/// <reference path="../../../../typings/globals/syncfusion/ej.web.all.d.ts" />
import {GridViewModelStammdatenNormal} from '../../../Helper/ViewModelHelper';
import {AlbumService} from './album-service';
import {I18N} from 'aurelia-i18n';
import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import 'syncfusion-javascript/content/ej/web/ej.widgets.core.material.less';
import 'syncfusion-javascript/content/ej/web/material/ej.theme.less';
import * as $ from 'jquery';

@autoinject()
export class AlbumList extends GridViewModelStammdatenNormal {
    //Objekt für i18n Namespace-Definition
    locOptions: any = { ns: ['StammAlbum', 'translation'] };

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, router: AppRouter, service: AlbumService) {
        //Aufrufen des C'tor des Vaters
        super(localize, aggregator, dialog, 'albumedit', router, service)
        
        //Setzen der Filteroptionen für das Grid
        this.gridFilterSettings = { filterType : "excel"};

        //Setzen der Grouping-Optionen für das Grid
        // this.gridGroupSettings = { groupedColumns: ["ShipCountry"], showToggleButton: true, showGroupedColumn: false };
        this.gridGroupSettings = { showToggleButton: true, showGroupedColumn: false };

        //Setzen der Sortier-Optionen für das Grid
        this.gridSortSettings = { sortedColumns: [{ field: "NameGerman", direction: "ascending" }]};

        //Setzen der Editier-Optionen für das Grid
        this.gridEditSettings = { allowEditing: false };

        //Setzen der Selection-Optionen für das Grid
        this.gridSelectionSettings = { selectionMode: ["row"] };
    }

    //Wird hier nicht benötigt
    protected attachedChild(): void {
    }

    //Wird von Aurelia zeitverzögert aufgerufen wenn die View zum DOM hinzugefügt wird
    protected attachedChildTimeOut() : void 
    {
        //Ermitteln der Grid-Instanz
        this.grid = $("#grid_Media_Group").data("ejGrid");

        // //Selektieren des gewünschten Items
        this.selectItem();

        // //Überprüfen des Enabled-State
        this.checkEnabledState();
    }

    //Selektieren des Items mit der geforderten ID oder Grid ohne Selektion
    private selectItem(): void {
        //Aktuelle Selektion aufheben
        this.grid.clearSelection();
        
        //Wenn eine ID übergeben wurde, dann muss die entsprechende
        //Zeile im Grid selektiert werden
        if (this.haveToSelectID) {
            for (var i: number = 0; i < this.grid.getCurrentViewData().length; i++) {
                if (this.grid.getCurrentViewData()[i].ID == this.IDToSelect) {
                  //Bisherigen Modus merken
                  var OldMode: ej.Grid.SelectionType|string|undefined = this.grid.model.selectionType;
                  
                  //Der Modus muss auf Multiple umgestellt werden da die Selektion sonst nicht funktioniert
                  this.grid.model.selectionType = ej.Grid.SelectionType.Multiple;

                  //Selektieren der Zeile
                  this.grid.selectRows(i, i);

                  //Alten Modus wiederherstellen
                  this.grid.model.selectionType = OldMode;

                  //Schleife verlassen
                  break;
                }
            }
        }
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
                this.grid.getScrollObject().scrollY(rowHeight * args.rowIndex, true, 1);
            }
            catch (ex)
            {
                //Wenn hier eine Exception auftaucht dann ist der Scroller nicht initialisiert,
                //da das Grid aktuell keinen Braucht wegen der zu geringen Anzahl an Items
            }

            //Setzen des Flags
            this.selectedID = args.data.ID;
            this.isItemSelected = true;
        }
        else {
          //Setzen des Flags
          this.isItemSelected = false;
        }
  
        //Setzen des Enabled-State
        this.checkEnabledState();
  }

    //Wird von der Vater-Klasse aufgerufen wenn die View vom Router
    //aktiviert wird aber noch nicht angezeigt. 
    protected async activateChild(info: any): Promise<void> {
        //Wenn keine ID vorhanden ist, dann muss kein Eintrag selektiert werden
        //Ansonsten muss der Eintrag mit der ID selektiert werden. Daher wird
        //die ID gespeichert um sie später zur Selektion zu verwenden
        if (!info.id) {
            this.haveToSelectID = false;
        }
        else {
            this.haveToSelectID = true;
            this.IDToSelect = info.id;
        }
    }

    //Wird durch Framework automatisch aufgerufen wenn der Enabled-State der Buttons 
    //neu überprüft werden muss
    protected checkEnabledState(): void {
        //Je nach dem ob gerade der Busy-State aktiv ist
        //werden die einzelnen Properties gesetzt
        if (this.isBusy) {
            //Deaktivieren der Buttons
            this.isAddEnabled = false;
            this.isDeleteEnabled = false;
            this.isEditEnabled = false;
            this.isRefreshEnabled = false;
        }
        else {
            //Aktivieren der Buttons
            this.isAddEnabled = true;
            this.isRefreshEnabled = true;
            if (this.isItemSelected) {
                this.isEditEnabled = true;
                this.isDeleteEnabled = true;
            }
            else {
                this.isEditEnabled = false;
                this.isDeleteEnabled = false;
            }
        }
    }

    //Wird vom Framework aufgerufen wenn sich der isBusy-Status geändert hat
    protected busyStateChanged(): void {

    }

    //Eine neues Album hinzufügen (Wird vom Add-Button aufgerufen)
    public addNew(): void {
        //Es muss zur Seite mit der Eingabe eines neuen Albums gesprungen werden
        this.router.navigate(this.routeForEdit + "/new/0");
    }

    //Das aktuell selektierte Album editieren (Wird vom Edit-Button aufgerufen)
    public editCurrent(): void {
        //Es muss zur Seite mit dem Editieren einer Kategorie gesprungen werden
        this.router.navigate(this.routeForEdit + "/edit/" + this.selectedID);
    }
}
