import { HttpResponseMessage } from 'aurelia-http-client';
import { AppRouter } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ValidationRules, ValidationController, validateTrigger } from 'aurelia-validation';
import { ViewModelGeneral } from '../../Helper/ViewModelHelper';
import { RegisterModel } from '../../Models/Auth/RegisterModel';
import { AuthorizationHelper } from '../../Helper/AuthorizationHelper';
import { DropdownListData } from '../../Helper/DropDownListHelper';
import swal from 'sweetalert2';

@inject(I18N, EventAggregator, NewInstance.of(ValidationController), AppRouter, AuthorizationHelper, RegisterModel)
export class Register extends ViewModelGeneral {
  //Objekt für i18n Namespace-Definition
  locConfig: any = { ns: ['AuthRegister', 'translation'] };

  //Members
  router: AppRouter;
  authHelper: AuthorizationHelper;

  titleDropdownGender: string;
  genderList: DropdownListData;
  titleDropdownCountry: string;
  countryList: DropdownListData;
  titleDropdownQuestion: string;
  securityQuestionList: DropdownListData;
    
  model: RegisterModel;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, validationController: ValidationController, router: AppRouter, 
               authHelper: AuthorizationHelper, model: RegisterModel) {
      //Aufrufen des Constructors der Vater-Klasse
      super(localize, eventAggregator, validationController);
        
      //Übernehmen der Parameter
      this.model = model;
      this.router = router;
      this.authHelper = authHelper;

      //Ermitteln der Liste der Sicherheitsfragen aus dem Helper
      this.titleDropdownQuestion = this.loc.tr('Labels.Question', this.locConfig);
      this.securityQuestionList = this.authHelper.getSecurityQuestionList();

      //Ermitteln der Länderliste aus dem Helper
      this.titleDropdownCountry = this.loc.tr('Labels.Country', this.locConfig);
      this.countryList = this.authHelper.getCountryList();

      //Ermitteln der Liste mit den Geschlechtern aus dem Helper
      this.titleDropdownGender = this.loc.tr('Labels.Gender', this.locConfig);
      this.genderList = this.authHelper.getGenderList();
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

  //Mit dieser Methode wird eine Registrierung an den Server abgesetzt
  public async register(): Promise<void> {
    //Deklaration
    let Response: HttpResponseMessage;

    //Busy-Meldung setzen
    this.setBusyState(true);

    //Übernehmen der ausgewählten Werte in den Combo-Boxen
    try {
      this.model.gender = this.genderList.getChangedValues()[0].id as number;
    }
    catch (ex) {
      this.model.gender = null;
    }
    try {
      this.model.country = this.countryList.getChangedValues()[0].id as string;
    }
    catch (ex) {
      this.model.country = null;
    }
    try {
      this.model.securityQuestion = this.securityQuestionList.getChangedValues()[0].id as number;
    }
    catch (ex) {
      this.model.securityQuestion = null;
    }
    
    //Vor dem Speichern noch mal eine Validierung starten
    await this.validationController.validate();
        
    //Wenn keine Fehler aufgetreten sind, dann kann die
    //Registrierung durchgeführt werden
    if (this.validationController.errors.length == 0) {
      try {
        //Durchführen der Registrierung
        Response = await this.authHelper.register(this.model);   

        //Busy-Meldung zurücksetzen
        this.setBusyState(false);

        //Registrierung wurde erfolgreich durchgeführt. Ausgeben einer entsprechenden Meldung
        try {
          await swal(
          {
              titleText: this.loc.tr('AuthRegister.Sucess.Header', { ns: 'Alerts' }),
              text: this.loc.tr('AuthRegister.Sucess.Body', { ns: 'Alerts' }),
              type: 'success',
              width: 600,
              showCancelButton: false,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
          });

          //Auf die Login Seite springen
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
        
        //Fehler bei der Registrierung aufgetreten. Meldung ausgeben
        try {
          await swal(
          {
              titleText: this.loc.tr('AuthRegister.Error.Header', { ns: 'Alerts' }),
              text: errors.length == 0 ? this.loc.tr('AuthRegister.Error.Body', {ns: 'Alerts'}) : this.loc.tr('AuthRegister.Error.Body_With_Error', {ns: 'Alerts'}) + errors.join(', '),
              type: 'error',
              width: 600,
              showCancelButton: false,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false
          });

          //Auf die Login Seite springen
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

  //Aufrufen der Login-View
  public login(): void {
    this.router.navigate("loginuser");
  }

  //Aufrufen der Seite für "Passwort vergessen"
  public forgotPassword(): void {
    this.router.navigate("forgotpassword");
  }

  //Wird von Aurelia aufgerufen ob die View verlassen werden darf
  private async canDeactivate(): Promise<boolean> {
    //Wenn gerade eine Registrierung läuft, darf die Seite nicht verlassen werden
    if (this.isBusy) {
      return Promise.resolve(false);
    }
    else {
      return Promise.resolve(true)
    }
  }
}
