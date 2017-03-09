import * as toastr from 'toastr';

export class ToastrHelper {
  //Zeigt ein Info-Toastr an
  public showNotifyInfo(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(5000);

    //Anzeigen des Toasts
    toastr.info(message);
  }

  //Zeigt ein Erfolgs-Toastr an
  public showNotifySuccess(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(10000);

    //Anzeigen des Toasts
    toastr.success(message);
  }

  //Zeigt ein Error-Toastr an
  public showNotifyError(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(10000);

    //Anzeigen des Toasts
    toastr.error(message);
  }

  //Zeigt ein Warning-Toastr an
  public showNotifyWarning(message: string): void {
    //Setzen der Optionen
    this.setToastrOptions(5000);

    //Anzeigen des Toasts
    toastr.warning(message);
  }

  //Liefert ein Objekt für die Notify-Optionen zurück
  private setToastrOptions(delayTime: number): void {
    toastr.options.closeButton = false;
    toastr.options.debug = false;
    toastr.options.newestOnTop = true;
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-top-right";
    toastr.options.preventDuplicates = false;
    toastr.options.showDuration = 300;
    toastr.options.hideDuration = 300;
    toastr.options.timeOut = delayTime;
    toastr.options.extendedTimeOut = 1000;
    toastr.options.showEasing = "swing";
    toastr.options.hideEasing = "linear";
    toastr.options.showMethod = "slideDown";
    toastr.options.hideMethod = "slideUp";
  }
}
