import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { FacetValue } from './FacetValue';
import { enFacetType } from "Enum/FamilieLaissEnum";
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { UploadPictureItem } from './UploadPictureItem';

@idProperty('ID')
@name('UploadPictureImageProperty')
@identifier('UploadPictureImageProperty')
@resource('uploadpictureimageproperty')
@validation()
@autoinject()
export class UploadPictureImageProperty extends Entity {
  @type('number')
  public ID: number;

  @type('number')
  public Rotate: number;

  @association('UploadPictureItem') 
  public UploadPicture: UploadPictureItem;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
    ValidationRules
      .ensure((p: UploadPictureImageProperty) => p.Rotate)
      .required()
      .on(this);
  }
}
