/// <reference path="../../../../typings/globals/syncfusion/ej.web.all.d.ts" />
import {GridViewModelStammdatenID} from '../../../Helper/ViewModelHelper';
import {CategoryValueService} from './categoryvalue-service';
import {I18N} from 'aurelia-i18n';
import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import 'syncfusion-javascript/content/ej/web/ej.widgets.core.material.less';
import 'syncfusion-javascript/content/ej/web/material/ej.theme.less';
import * as $ from 'jquery';
import { ForeignKeyData } from './../../../Models/ForeignKeyData';
import swal from 'sweetalert2';
import {LoadDataWithFatherModel} from '../../../Models/LoadDataWithFatherModel'

@autoinject()
export class CategoryValueList extends GridViewModelStammdatenID {
    //Objekt für i18n Namespace-Definition
    locConfig: any = { ns: ['StammCategoryValue', 'translation'] };
    
    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, router: AppRouter, service: CategoryValueService) {
        //Aufrufen des C'tor des Vaters
        super(localize, aggregator, dialog, 'categoryvalueedit', 'category', router, service)
        
        //Setzen der Filteroptionen für das Grid
        this.gridFilterSettings = { filterType : "excel"};

        //Setzen der Grouping-Optionen für das Grid
        this.gridGroupSettings = { showToggleButton: true, showGroupedColumn: false };

        //Setzen der Sortier-Optionen für das Grid
        this.gridSortSettings = { sortedColumns: [{ field: "NameGerman", direction: "ascending" }]};

        //Setzen der Editier-Optionen für das Grid
        this.gridEditSettings = { allowEditing: false };

        //Setzen der Selection-Optionen für das Grid
        this.gridSelectionSettings = { selectionMode: ["row"] };

        //Setzen der Scroll-Settings für das Grid
        this.gridScrollSettings = { width: '100%', height: 400 };
    }

    //Wird von Aurelia aufgerufen
    protected attachedChild(): void {
    }

    //Wird von Aurelia zeitverzögert aufgerufen wenn die View zum DOM hinzugefügt wird
    protected attachedChildTimeOut() : void 
    {
        //Ermitteln der Grid-Instanz
        this.grid = $("#grid_CategoryValue").data("ejGrid");

        //Selektieren des gewünschten Items
        this.selectItem();

        //Überprüfen des Enabled-State
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

                  //Wenn die ID einmal selektiert wurde, dann ist dieses
                  //für die zukünftigen Selektionen nicht mehr notwendig
                  this.haveToSelectID = false;

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
            this.isBackEnabled = false;
        }
        else {
            //Aktivieren der Buttons
            this.isAddEnabled = true;
            this.isRefreshEnabled = true;
            this.isBackEnabled = true;
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

    //Eine neue Kategorie hinzufügen (Wird vom Add-Button aufgerufen)
    public addNew(): void {
        //Es muss zur Edit-Seite gesprungen werden
        this.router.navigate(this.routeForEdit + "/new/" + this.fatherItem.ID + "/0");
    }

    //Die aktuell selektierte Kategorie editieren (Wird vom Edit-Button aufgerufen)
    public editCurrent(): void {
        //Es muss zur Edit-Seite gesprungen werden
        this.router.navigate(this.routeForEdit + "/edit/" + this.fatherItem.ID + "/" + this.selectedID);
    }

    //Zurück zur Liste der Kategorien springen welches die Vater View darstellt
    //(Wird vom Go-Back-Button aufgerufen)
    public goBack(): void {
        this.router.navigate(this.routeFather + "/" + this.fatherItem.ID);
    }

    //Die aktuell selektierte Kategorie löschen (Wird vom Delete-Button aufgerufen)
    public async deleteCurrent(): Promise<void> {
        try
        {
            //Ausgeben einer Sicherheitsabfrage ob wirklich gelöscht werden soll
            await swal(
                {
                    titleText: this.loc.tr('Delete.Facet_Value.Header', { ns: 'Alerts' }),
                    text: this.loc.tr('Delete.Facet_Value.Body', { ns: 'Alerts' }),
                    type: 'warning',
                    width: 600,
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: this.loc.tr('Delete.Facet_Value.Confirm_Button', { ns: 'Alerts' }),
                    cancelButtonText: this.loc.tr('Delete.Facet_Value.Cancel_Button', { ns: 'Alerts' }),
                    allowOutsideClick: false,
                    allowEscapeKey: false
             });
      
             //Einblenden der Busy-Box
             this.setBusyState(true);

             try
             {
                 //Löschen des Items über den Service
                 await this.service.deleteItem(this.selectedID);

                 //Das selektierte Item zurücksetzen
                 this.isItemSelected = false;

                 //Aktualisieren der Daten
                 var Result:LoadDataWithFatherModel = await this.service.getData(this.fatherItem.ID);
                 this.entities = Result.entities;

                 //Selektion im Grid bestimmen
                 this.selectItem();

                 //Ausblenden der Busy-Box
                 this.setBusyState(false);
 
                 //Enabled-State aktualisieren
                 this.checkEnabledState();

                 //Ausgeben einer Erfolgsmeldung
                 this.showNotifySuccess(this.loc.tr('CategoryValue.Delete.Success', { ns: 'Toasts' }));
             }
             catch (ex)
             {
                 //Ausblenden der Busy-Box
                 this.setBusyState(false);

                 //Zurücknehmen der Änderungen (Delete-State)
                 this.service.rejectChanges();

                 //Ausgeben einer Fehlermeldung
                 this.showNotifyError(this.loc.tr('CategoryValue.Delete.Success', { ns: 'Toasts' }));
             }
        }
        catch (ex)
        {
            //Die Sicherheitsabfrage wurde mit "Nein" beantwortet. Es muss nichts gemacht werden
        }
    }

    //Das Grid mit neuen Daten vom Server aktualisieren
    public async refreshGrid(): Promise<void> {
        //Busy-State setzen
        this.setBusyState(true);

        //Aktualisieren der Daten
        var Result: LoadDataWithFatherModel = await this.service.refreshData(this.fatherItem.ID);
        this.entities = Result.entities;

        //Das selektierte Item zurücksetzen
        this.isItemSelected = false;

        //Selektieren des gewünschten Items
        this.selectItem();

        //Busy-State zurücksetzen
        this.setBusyState(false);
    }
}
