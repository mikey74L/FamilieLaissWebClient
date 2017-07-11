import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from '../../Helper/CustomValidationRuleHelper';
import { ValidationSettings } from './../../Config/ValidationSettings';

@autoinject()
export class RegisterModel {
  //Properties
  public userName: string;
  public gender: number;
  public firstName: string;
  public familyName: string;
  public street: string;
  public HNR: string;
  public PLZ: string;
  public city: string;
  public country: string;
  public eMail: string;
  public password: string;
  public passwordVerification: string;
  public securityQuestion: number;
  public securityAnswer: string;

  private loc: I18N;

  //C'tor
  constructor (localize: I18N, rules: CustomValidationRuleHelper) {
    //Übernehmen der Parameter
    this.loc = localize;

    //Setzen der Validierungsregeln
    ValidationRules
      .ensure((p: RegisterModel) => p.userName)
        .displayName(this.loc.tr('Register.UserName.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(50)
        .then()
          .satisfiesRule('valueAlreadyExists', '', '', ValidationSettings.BaseURL + 'CheckUserName')
      .ensure((p: RegisterModel) => p.firstName)
        .displayName(this.loc.tr('Register.FirstName.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
      .ensure((p: RegisterModel) => p.familyName)
        .displayName(this.loc.tr('Register.FamilyName.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
      .ensure((p: RegisterModel) => p.street)
        .displayName(this.loc.tr('Register.Street.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
      .ensure((p: RegisterModel) => p.HNR)
        .displayName(this.loc.tr('Register.HNR.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(15)
      .ensure((p: RegisterModel) => p.PLZ)
        .displayName(this.loc.tr('Register.PLZ.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(15)
      .ensure((p: RegisterModel) => p.city)
        .displayName(this.loc.tr('Register.City.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
      .ensure((p: RegisterModel) => p.eMail)
        .displayName(this.loc.tr('Register.eMail.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
        .email()
        .then()
          .satisfiesRule('valueAlreadyExists', '', '', ValidationSettings.BaseURL + 'CheckMailAdress')
      .ensure((p: RegisterModel) => p.securityAnswer)
        .displayName(this.loc.tr('Register.SecurityAnswer.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
      .ensure((p: RegisterModel) => p.password)
        .displayName(this.loc.tr('Register.Password.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(20)
      .ensure((p: RegisterModel) => p.passwordVerification)
        .displayName(this.loc.tr('Register.PasswordConfirmation.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(20)
        .then()
          .satisfiesRule('matchesProperty', 'password')
    .on(this);
  }
}


