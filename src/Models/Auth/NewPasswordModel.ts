import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';

@autoinject()
export class NewPasswordModel {
  public userName: string;
  public token: string;
  public password: string;
  public passwordVerification: string;

  private loc: I18N;

  //C'tor
  constructor (localize: I18N) {
    //Übernehmen der Parameter
    this.loc = localize;

    //Setzen der Validierungsregeln
    ValidationRules
      .ensure((p: NewPasswordModel) => p.password)
        .displayName(this.loc.tr('Register.Password.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(20)
      .ensure((p: NewPasswordModel) => p.passwordVerification)
        .displayName(this.loc.tr('Register.PasswordConfirmation.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(20)
        .then()
          .satisfiesRule('matchesProperty', 'password')
    .on(this);
  }
}
