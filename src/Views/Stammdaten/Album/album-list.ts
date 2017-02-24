import {GridViewModelStammdatenNormal} from '../../../Helper/ViewModelHelper'
import {AlbumService} from './album-service';
import {I18N} from 'aurelia-i18n';
import {autoinject, singleton} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {AppRouter} from 'aurelia-router';

@autoinject()
@singleton()
export class AlbumList extends GridViewModelStammdatenNormal {
    //Objekt für i18n Namespace-Definition
    locOptions: any = { ns: ['StammAlbum', 'translation'] };

    //C'tor
    constructor(localize: I18N, aggregator: EventAggregator, dialog: DialogService, router: AppRouter, service: AlbumService) {
        super(localize, aggregator, dialog, 'albumedit', router, service)
    }

    protected attachedChild(): void {

    }

    protected async activateChild(info: any): Promise<void> {
      
    }

    protected checkEnabledState(): void {
      
    }

    protected busyStateChanged(): void {

    }
}
