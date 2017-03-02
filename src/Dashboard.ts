import { ShowBusyBoxEvent } from './Events/ShowBusyBoxEvent';
import { ViewModelGeneral } from './Helper/ViewModelHelper';
import { I18N } from 'aurelia-i18n';
import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

@autoinject()
export class Dashboard extends ViewModelGeneral {
// 	async testClick() {
//     try
//     {
//     await swal({titleText: 'Das ist Title',
//       text: 'Das ist der Text',
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#DD6B55',
//       confirmButtonText: 'Conf Button',
//       cancelButtonText: 'Canc Button',
//       allowOutsideClick: false,
//       allowEscapeKey: false});

//       swal('Confirm');
//     }
//     catch (ex)
//     {
// await swal('Cancel');
//     }
//   }
  constructor(loc: I18N, eventAggregator: EventAggregator) {
    super(loc, eventAggregator);
  }
    protected async activateChild(info: any): Promise<void> {
      return Promise.resolve();
    }
    protected busyStateChanged(): void {

    }
    protected checkEnabledState(): void {
    }
  testClick() {
    this.setBusyState(true);
  }
}
