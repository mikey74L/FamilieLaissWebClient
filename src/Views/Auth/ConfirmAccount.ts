import { HttpResponseMessage } from 'aurelia-http-client';
import { ConfirmAccountModel } from '../../Models/Auth/ConfirmAccountModel';
import { AuthorizationHelper } from '../../Helper/AuthorizationHelper';
import { ValidationController } from 'aurelia-validation';
import {AppRouter} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import { ViewModelGeneral } from "../../Helper/ViewModelHelper";
import swal from 'sweetalert2';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), AppRouter, AuthorizationHelper, ConfirmAccountModel)
export class ConfirmAccount extends ViewModelGeneral {
  //Objekt für i18n Namespace-Definition
  locConfig = { ns: ['AuthConfirmAccount'] };
    
  //Members
  router: AppRouter;
  authHelper: AuthorizationHelper;

  model: ConfirmAccountModel;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, 
               router: AppRouter, authHelper: AuthorizationHelper, model: ConfirmAccountModel) {
    //Aufrufen des Constructors der Vater-Klasse
    super(localize, eventAggregator, validationController);

    //Übernehmen des Routers
    this.router = router;
    this.authHelper = authHelper;
    this.model = model;
  }

  //Wird von der Vater-Klasse aufgerufen wenn die View vom Router
  //aktiviert wird aber noch nicht angezeigt. 
  protected async activateChild(info: any): Promise<void> {
  }

  //Wird vom Framework aufgerufen wenn sich der isBusy-Status geändert hat
  protected busyStateChanged(): void {
  }

  //Überprüft den Enabled State
  protected checkEnabledState(): void {
  }

  //Wird von Aurelia aufgerufen
  private activate(params): void {
    //Übernehmen der Parameter
    this.model.userName = params.userID;
    this.model.token = params.code;
  }

  //Wird aufgerufen wenn der Button zum Bestätigen geklickt wird
  private async confirmAccount(): Promise<void> {
    //Deklaration
    let Response: HttpResponseMessage;

    //Busy-Meldung setzen
    this.setBusyState(true);

    //Vor dem Speichern noch mal eine Validierung starten
    await this.validationController.validate();

    //Wenn keine Fehler aufgetreten sind, dann kann 
    //der Server kontaktiert werden
    if (this.validationController.errors.length == 0) {
      try {
        //Durchführen der Serveranfrage
        Response = await this.authHelper.confirmAccount(this.model);

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //       //Registrierung wurde erfolgreich durchgeführt. Ausgeben einer entsprechenden Meldung
        try {
          //Fehler bei der Registrierung aufgetreten. Meldung ausgeben
          await swal(
          {
              titleText: this.loc.tr('AuthConfirmAccount.Success.Header', { ns: 'Alerts' }),
              text: this.loc.tr('AuthConfirmAccount.Success.Body', { ns: 'Alerts' }),
              type: 'success',
              width: 600,
              showCancelButton: false,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
          });

          //Auf die Login-Page springen
          this.router.navigate("loginuser");
        }
        catch (exSWAL) {
          //Da das SWAL nicht Cancel bar ist kann hier niemals hingesprungen werden
        }
      }
      catch (ex) {
        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        try {
          //Fehler bei der Registrierung aufgetreten. Meldung ausgeben
          await swal(
          {
              titleText: this.loc.tr('AuthConfirmAccount.Error.Header', { ns: 'Alerts' }),
              text: this.loc.tr('AuthConfirmAccount.Error.Body', { ns: 'Alerts' }),
              type: 'error',
              width: 600,
              showCancelButton: false,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
          });

          //Auf die Login-Page springen
          this.router.navigate("loginuser");
        }
        catch (exSWAL) {
          //Da das SWAL nicht Cancel bar ist kann hier niemals hingesprungen werden
        }
      }
    }
    else {
      //Busy-Meldung zurücksetzen
      this.setBusyState(false);
    }
  }

  //Wird von Aurelia aufgerufen ob die View verlassen werden darf
  private async canDeactivate(): Promise<boolean> {
    //Wenn gerade eine Registrierung läuft, darf die Seite nicht verlassen werden
    if (this.isBusy) {
      return Promise.resolve(false);
    }
    else {
      return Promise.resolve(true);
    }
  }
}
