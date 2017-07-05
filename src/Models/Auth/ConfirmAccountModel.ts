import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';

@autoinject()
export class ConfirmAccountModel {
  public userName: string;
  public token: string;

  private loc: I18N;

  //C'tor
  constructor (localize: I18N) {
    //Übernehmen der Parameter
    this.loc = localize;

    //Setzen der Validierungsregeln
  }
}
