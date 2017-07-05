import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';

@autoinject()
export class LoginModel {
  //Properties
  public userName: string;
  public password: string;

  private loc: I18N;

  //C'tor
  constructor (localize: I18N) {
    //Übernehmen der Parameter
    this.loc = localize;

    //Setzen der Validierungsregeln
    ValidationRules
      .ensure((p: LoginModel) => p.userName)
        .displayName(this.loc.tr('Login.UserName.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(50)
      .ensure((p: LoginModel) => p.password)
        .displayName(this.loc.tr('Login.Password.DisplayName', {ns: 'Metadata'}))
        .required()
        .maxLength(20)
    .on(this);
  }
}


