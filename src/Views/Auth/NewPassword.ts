import { HttpResponseMessage } from 'aurelia-http-client';
import { NewPasswordModel } from '../../Models/Auth/NewPasswordModel';
import { AuthorizationHelper } from '../../Helper/AuthorizationHelper';
import {AppRouter} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import { ViewModelGeneral } from "../../Helper/ViewModelHelper";
import swal from 'sweetalert2';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), AppRouter, AuthorizationHelper, NewPasswordModel)
export class NewPassword extends ViewModelGeneral {
  //Objekt für i18n Namespace-Definition
  locConfig = { ns: ['AuthNewPassword', 'translation'] };

  //Members
  router: AppRouter;
  authHelper: AuthorizationHelper;

  model: NewPasswordModel;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, 
               router: AppRouter, authHelper: AuthorizationHelper, model: NewPasswordModel) {
    //Aufrufen des Constructors der Vater-Klasse
    super(localize, eventAggregator, validationController);
        
    //Übernehmen der Parameter
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
    this.model.userName = params.userName;
    this.model.token = params.token;
  }

  //Neues Passwort vergeben
  private async newPassword(): Promise<void> {
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
        Response = await this.authHelper.newPassword(this.model);   

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //Neues Passwort wurde erfolgreich vergeben. Ausgeben einer entsprechenden Meldung
        try {
          await swal(
          {
              titleText: this.loc.tr('AuthNewPassword.Success.Header', { ns: 'Alerts' }),
              text: this.loc.tr('AuthNewPassword.Success.Body', { ns: 'Alerts' }),
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
          //Fehler beim Setzen des neuen Passworts. Meldung ausgeben
          await swal(
          {
              titleText: this.loc.tr('AuthNewPassword.Error.Header', { ns: 'Alerts' }),
              text: this.loc.tr('AuthNewPassword.Error.Body', { ns: 'Alerts' }),
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

        }
      }
    }
    else {
      //Busy-Meldung zurücksetzen
      this.setBusyState(false);
    }
  }
 
  //Aufrufen der Login-View
  private login(): void {
    this.router.navigate("loginuser");
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
