import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { AppRouter } from 'aurelia-router';
import { ValidationController } from 'aurelia-validation';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ViewModelGeneral } from '../../Helper/ViewModelHelper';
import { LoginModel } from '../../Models/Auth/LoginModel';
import { AuthorizationHelper } from '../../Helper/AuthorizationHelper';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), AppRouter, AuthorizationHelper)
export class Login extends ViewModelGeneral {
  //Objekt für i18n Namespace-Definition
  private locConfig = { ns: ['AuthLogin', 'translation'] };

  //Members
  private router: AppRouter;
  private model: LoginModel;
  private authHelper: AuthorizationHelper;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, router: AppRouter, 
               authHelper: AuthorizationHelper, framework, model: LoginModel) {
        //Aufrufen des Constructors der Vater-Klasse
        super(localize, eventAggregator, validationController);
        
        //Übernehmen der Parameter
        this.router = router;
        this.authHelper = authHelper;
        this.aurelia = framework;
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
  private login(): void {
        // //Busy-Meldung setzen
        // this.setBusyState(true);

        // //Validierung durchführen. Diese wird in einem Promise durchgeführt
        // this.validationController.validate()
        // .then(errors => {
        //     //Wenn keine Fehler aufgetreten sind, dann kann der
        //     //Login durchgeführt werden
        //     if (errors.length == 0) {
        //         //Durchführen des Logins
        //         this.authHelper.login(this.loginData)   
        //           .then(message => {
        //               //Busy-Meldung zurücksetzen
        //               this.setBusyState(false);

        //               //Übernehmen der Response-Daten
        //               let data = message.content;
        //               this.authHelper.setAuthInfo(data['userName'], data['firstName'], data['familyName'], data['roles'], data['access_token'], false);

        //               //Auf den Root der Applikation wechseln
        //               this.router.navigate("dashboard");
        //           }, message => {
        //               //Deklaration
        //               var errors = [];

        //               //Busy-Meldung zurücksetzen
        //               this.setBusyState(false);

        //               //Auswerten etwaiger Fehlermeldungen bei einem Bad-Request
        //               if (message.statusCode == 400) {
        //                   errors.push(message.content.error_description);
        //               }

        //               //Fehler bei der Registrierung aufgetreten. Meldung ausgeben
        //               swal({
        //                   title: this.loc.tr('AuthLogin.Error.Header', {ns: 'Alerts'}),
        //                   text: errors.length == 0 ? this.loc.tr('AuthLogin.Error.Body', {ns: 'Alerts'}) : errors[0],
        //                   type: "error",
        //                   showCancelButton: false,
        //                   confirmButtonText: 'OK',
        //                   closeOnConfirm: true,
        //                   allowEscapeKey: false
        //               }, (isConfirm) => {
        //                   if (isConfirm) {
        //                       //Nichts machen da Fehler. User bleibt auf Login-Page stehen
        //                   }
        //               });
        //           });
        //     }
        //     else {
        //         //Busy-Meldung zurücksetzen
        //         this.setBusyState(false);
        //     }
        // });
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
  private canDeactivate(): boolean {
    //Wenn gerade eine Registrierung läuft, darf die Seite nicht verlassen werden
    if (this.isBusy) {
      return false;
    }
    else {
      return true;
    }
  }
}
