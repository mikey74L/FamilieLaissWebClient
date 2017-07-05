import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';

@autoinject()
export class ForgotPasswordModel {
  public eMail: string;
  public securityQuestion: number;
  public securityAnswer: string;

  private loc: I18N;

  //C'tor
  constructor (localize: I18N) {
    //Übernehmen der Parameter
    this.loc = localize;

    //Setzen der Validierungsregeln
    ValidationRules
      .ensure((p: ForgotPasswordModel) => p.eMail)
        .displayName(this.loc.tr('Register.eMail.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
        .email()
      .ensure((p: ForgotPasswordModel) => p.securityAnswer)
        .displayName(this.loc.tr('Register.SecurityAnswer.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(256)
    .on(this);
  }
}
