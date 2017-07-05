import { HttpResponseMessage } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { AppRouter } from 'aurelia-router';
import { ValidationController } from 'aurelia-validation';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ViewModelGeneral } from '../../Helper/ViewModelHelper';
import { LoginModel } from '../../Models/Auth/LoginModel';
import { AuthorizationHelper } from '../../Helper/AuthorizationHelper';
import swal from 'sweetalert2';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), AppRouter, AuthorizationHelper, LoginModel)
export class Login extends ViewModelGeneral {
  //Objekt für i18n Namespace-Definition
  private locConfig = { ns: ['AuthLogin', 'translation'] };

  //Members
  private router: AppRouter;
  private model: LoginModel;
  private authHelper: AuthorizationHelper;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, router: AppRouter, 
               authHelper: AuthorizationHelper, model: LoginModel) {
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

  //Wird aufgerufen wenn auf den Login-Button geklickt wird
  private async login(): Promise<void> {
    //Deklaration
    let Response: HttpResponseMessage;

    //Busy-Meldung setzen
    this.setBusyState(true);

    //Vor dem Speichern noch mal eine Validierung starten
    await this.validationController.validate();

    //Wenn keine Fehler aufgetreten sind, dann kann der
    //Login durchgeführt werden
    if (this.validationController.errors.length == 0) {
      try {
        //Durchführen des Logins
        Response = await this.authHelper.login(this.model);   

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //Übernehmen der Response-Daten
        let data: any = Response.content;
        this.authHelper.setAuthInfo(data['userName'], data['firstName'], data['familyName'], data['roles'], data['access_token'], false);

        //Auf den Root der Applikation wechseln
        this.router.navigate("dashboard");
      }
      catch (ex) {
        //Deklaration
        let ErrorResponse: HttpResponseMessage = ex as HttpResponseMessage;
        let errors: Array<string> = [];

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //Auswerten etwaiger Fehlermeldungen bei einem Bad-Request
        if (ErrorResponse.statusCode == 400) {
          errors.push(ErrorResponse.content.error_description);
        }

        //Fehler beim Login aufgetreten. Meldung ausgeben
        try {
          await swal(
          {
              titleText: this.loc.tr('AuthLogin.Error.Header', { ns: 'Alerts' }),
              text: errors.length == 0 ? this.loc.tr('AuthLogin.Error.Body', {ns: 'Alerts'}) : errors[0],
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

  //Aufrufen der Registrierungsseite
  private register(): void {
    this.router.navigate("registeruser");
  }

  //Aufrufen der Passwort vergessen Seite
  private forgotPassword(): void {
    this.router.navigate("forgotpassword");
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
