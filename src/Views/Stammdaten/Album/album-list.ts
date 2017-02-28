import {GridViewModelStammdatenNormal} from '../../../Helper/ViewModelHelper';
import {AlbumService} from './album-service';
import {I18N} from 'aurelia-i18n';
import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';
import 'syncfusion-javascript/content/ej/web/ej.widgets.core.material.less';
import 'syncfusion-javascript/content/ej/web/material/ej.theme.less';

@autoinject()
export class AlbumList extends GridViewModelStammdatenNormal {
    //Objekt für i18n Namespace-Definition
    locOptions: any = { ns: ['StammAlbum', 'translation'] };

    //Members für das Grid
    gridFilterSettings: any;
    gridGroupSettings: any;
    gridSortSettings: any;
    gridEditSettings: any;
    gridSelectionSettings: any;
    gridScrollSettings: any;

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, router: AppRouter, service: AlbumService) {
        //Aufrufen des C'tor des Vaters
        super(localize, aggregator, dialog, 'albumedit', router, service)
        
        //Setzen der Filteroptionen für das Grid
        this.gridFilterSettings = {filterType : "excel"};

        //Setzen der Grouping-Optionen für das Grid
        // this.gridGroupSettings = { groupedColumns: ["ShipCountry"], showToggleButton: true, showGroupedColumn: false };
        this.gridGroupSettings = { showToggleButton: true, showGroupedColumn: false };

        //Setzen der Sortier-Optionen für das Grid
        this.gridSortSettings = { sortedColumns: [{ field: "NameGerman", direction: "ascending" }]};

        //Setzen der Editier-Optionen für das Grid
        this.gridEditSettings = { allowEditing: false };

        //Setzen der Selection-Optionen für das Grid
        this.gridSelectionSettings = { selectionMode: ["row"] };

        this.gridScrollSettings = { height: 600 };
    }

    protected attachedChild(): void {
        //Überprüfen des Enabled-State
        this.checkEnabledState();
    }
 
    //Selektieren des Items mit der geforderten ID oder Grid ohne Selektion
    private selectItem() {
    }

    protected async activateChild(info: any): Promise<void> {
    }

    protected checkEnabledState(): void {
        //Je nach dem ob gerade der Busy-State aktiv ist
        //werden die einzelnen Properties gesetzt
        if (this.isBusy) {
            //Deaktivieren der Buttons
            this.isAddEnabled = false;
            this.isDeleteEnabled = false;
            this.isEditEnabled = false;
            this.isRefreshEnabled = false;

            //Deaktivieren des Grids
            //this.Grid.disabled = true;
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

            //Aktivieren des Grids
            //this.Grid.disabled = false;
        }
    }

    protected busyStateChanged(): void {

    }

    //Eine neues Album hinzufügen (Wird vom Add-Button aufgerufen)
    public addNew(): void {
        //Es muss zur Seite mit der Eingabe eines neuen Albums gesprungen werden
        this.router.navigate(this.routeForEdit + "/new/0");
    }
}
