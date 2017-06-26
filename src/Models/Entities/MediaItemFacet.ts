import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { FacetValue } from './FacetValue';
import { MediaItem } from './MediaItem';

@idProperty('ID')
@name('MediaItemFacet')
@identifier('MediaItemFacet')
@resource('mediaitemfacet')
@validation()
@autoinject()
export class MediaItemFacet extends Entity {
  @type('number')
  public ID: number;

  @type('number')
  public ID_MediaItem: number;

  @type('number')
  public ID_FacetValue: number;

  @association('FacetValue') 
  public FacetValue: FacetValue;

  @association('MediaItem') 
  public MediaItem: MediaItem;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
    ValidationRules
      .ensure((p: MediaItemFacet) => p.ID_MediaItem)
      .required()
      .ensure((p: MediaItemFacet) => p.ID_FacetValue)
      .required()
      .on(this);
  }
}
