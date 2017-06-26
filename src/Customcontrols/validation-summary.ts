import { ValidationController } from 'aurelia-validation';
import { bindable, customElement, containerless } from 'aurelia-framework';

@customElement('validation-summary')
export class ValidationSummary {
  //Members
  @bindable() controller: ValidationController;

  //Wird aufgerufen wenn auf einen Fehler geklickt wird
  //dann wird Versucht auf das Element mit dem Fehler den Focus zu setzen
  private setFocus(): void {
    try {
    }
    catch (ex) {
       //Wenn eine Exception auftritt ist das egal, dann kann halt kein Focus gesetzt werden
    }
  }
}
