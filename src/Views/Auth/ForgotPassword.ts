import { HttpResponseMessage } from 'aurelia-http-client';
import { ForgotPasswordModel } from '../../Models/Auth/ForgotPasswordModel';
import { DropdownListData } from '../../Helper/DropDownListHelper';
import { AuthorizationHelper } from '../../Helper/AuthorizationHelper';
import {AppRouter} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import {ViewModelGeneral} from '../../Helper/ViewModelHelper';
import swal from 'sweetalert2';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), AppRouter, AuthorizationHelper, ForgotPasswordModel)
export class ForgotPassword extends ViewModelGeneral {
  //Objekt für i18n Namespace-Definition
  locConfig = { ns: ['AuthForgotPassword', 'translation'] };

  //Members
  router: AppRouter;
  authHelper: AuthorizationHelper;
  model: ForgotPasswordModel;

  titleDropdownQuestion: string;
  securityQuestionList: DropdownListData;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController,
               router: AppRouter, authHelper: AuthorizationHelper, model: ForgotPasswordModel) {
    //Aufrufen des Constructors der Vater-Klasse
    super(localize, eventAggregator, validationController);
        
    //Übernehmen der Parameter
    this.router = router;
    this.authHelper = authHelper;
    this.model = model;

    //Ermitteln der Liste der Sicherheitsfragen aus dem Helper
    this.titleDropdownQuestion = this.loc.tr('Labels.Question', this.locConfig);
    this.securityQuestionList = this.authHelper.getSecurityQuestionList();
    this.securityQuestionList.setValue(1, true);
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

  //Zurücksetzen des Passworts anfordern
  private async resetPassword(): Promise<void> {
    //Deklaration
    let Response: HttpResponseMessage;

    //Busy-Meldung setzen
    this.setBusyState(true);

    //Übernehmen der ausgewählten Sicherheitsfrage aus der Combo-Box
    try {
      this.model.securityQuestion = this.securityQuestionList.getChangedValues()[0].id as number;
    }
    catch (ex) {
      this.model.securityQuestion = null;
    }
    
    //Vor dem Speichern noch mal eine Validierung starten
    await this.validationController.validate();

    //Wenn keine Fehler aufgetreten sind, dann kann 
    //der Server kontaktiert werden
    if (this.validationController.errors.length == 0) {
      try {
        //Durchführen der Serveranfrage
        Response = await this.authHelper.resetPassword(this.model);

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //Die Serveranfrage wurde erfolgreich durchgeführt. Ausgeben einer entsprechenden Meldung
        try {
          await swal(
          {
              titleText: this.loc.tr('AuthForgotPassword.Success.Header', { ns: 'Alerts' }),
              text: this.loc.tr('AuthForgotPassword.Success.Body', { ns: 'Alerts' }),
              type: 'success',
              width: 600,
              showCancelButton: false,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
          });

          //Auf die Login-Seite springen
          this.router.navigate("loginuser");
        }
        catch (exSWAL) {
          //Da das SWAL nicht Cancel bar ist kann hier niemals hingesprungen werden
        }
      }
      catch (ex) {
        //Deklaration
        let ErrorResponse: HttpResponseMessage = ex as HttpResponseMessage;
        let errors: Array<string> = [];

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //Auswerten etwaiger Fehlermeldungen bei einem Bad-Request
        if (ErrorResponse.statusCode == 400) {
          for (var key in ErrorResponse.content.modelState) {
            for (var i = 0; i < ErrorResponse.content.modelState[key].length; i++) {
               errors.push(ErrorResponse.content.modelState[key][i]);
            }
          }
        }

        //Ausgeben einer Fehlermeldung
        try {
          await swal(
          {
              titleText: this.loc.tr('AuthForgotPassword.Error.Header', { ns: 'Alerts' }),
              text: errors.length == 0 ? this.loc.tr('AuthForgotPassword.Error.Body', {ns: 'Alerts'}) : this.loc.tr('AuthForgotPassword.Error.Body_With_Error', {ns: 'Alerts'}) + errors.join(', '),
              type: 'error',
              width: 600,
              showCancelButton: false,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
          });
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
