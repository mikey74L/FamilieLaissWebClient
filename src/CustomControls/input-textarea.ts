import {bindable, customElement, containerless} from 'aurelia-framework';
import {Entity, DataProperty, ValidationError, ValidationErrorsChangedEventArgs} from 'breeze-client';

@customElement('input-textarea')
@containerless()
export class InputTextarea {
    //Members
    @bindable value: any;
    @bindable({
        changeHandler: 'entityChanged'
    }) entity: Entity;
    @bindable({
        changeHandler: 'propertyChanged'
    }) entityProperty: DataProperty;
    @bindable isBusy: Boolean;

    displayName: string;
    toggled: boolean;
    hasValidationError: boolean;
    validationError: string;

    //Wird aufgerufen wenn sich die Entity geändert hat
    private entityChanged(): void {
        //Für das Validation-Errors-Changed-Event registrieren
        this.entity.entityAspect.validationErrorsChanged.subscribe((eventArgs) => {
            var _Errors: Array<ValidationError> = this.entity.entityAspect.getValidationErrors(this.entityProperty.name);
            if (_Errors.length > 0) {
                this.hasValidationError = true;
                this.validationError = _Errors[0].errorMessage;
            }
            else {
                this.hasValidationError = false;
                this.validationError = "";
            }
        });

        //Initiales auslesen des Validierungszustandes
        if (this.entityProperty != null && this.entity != null) {
            var _Errors: Array<ValidationError> = this.entity.entityAspect.getValidationErrors(this.entityProperty.name);
            if (_Errors.length > 0) {
                this.hasValidationError = true;
                this.validationError = _Errors[0].errorMessage;
            }
            else {
                this.hasValidationError = false;
                this.validationError = "";
            }
        }
    }

    private propertyChanged(): void {
        //Initiales auslesen des Validierungszustandes aber nur wenn auch eine Property und eine Entity gesetzt wurde
        if (this.entityProperty != null && this.entity != null) {
            //Auslesen der Validierungsfehler
            var _Errors: Array<ValidationError> = this.entity.entityAspect.getValidationErrors(this.entityProperty.name);
            if (_Errors.length > 0) {
                this.hasValidationError = true;
                this.validationError = _Errors[0].errorMessage;
            }
            else {
                this.hasValidationError = false;
                this.validationError = "";
            }

            //Setzen des DisplayNames
            this.displayName = this.entityProperty.displayName;
        }
    }

    //Wird aufgerufen wenn die Input-Box den Focus bekommt
    public elementGotFocus(): void {
        this.toggled = true;
    }

    //Wird aufgerufen wenn die Input-Box den Focus verliert
    public elementLostFocus(eventData: any): void {
        //Wenn sich ein Text im Eingabefeld befindet
        //dann darf nicht mehr getoggled werden
        if (eventData.srcElement.value.length == 0) {
            this.toggled = false;
        }
    }

    public attached(): void {
        //Wenn das Element zum Dom hinzugefügt wird, dann
        //wird überprüft ob schon ein Text vorhanden ist.
        //Wenn ja dann wird die toggled Eigenschaft gesetzt
        if (this.value) {
            if (this.value.length > 0) this.toggled = true;
        }
    }
}
