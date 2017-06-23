import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { MediaItem } from './MediaItem';
import { UploadPictureImageProperty } from './UploadPictureImageProperty';

@idProperty('ID')
@name('UploadPictureItem')
@identifier('UploadPictureItem')
@resource('uploadpictureitem')
@validation()
@autoinject()
export class UploadPictureItem extends Entity {
  @type('number')
  public ID: number;

  @type('string')
  public NameOriginal: string;

  @type('datetime')
  public UploadDate: Date;

  @type('number')
  public HeightOriginal: number;

  @type('number')
  public WidthOriginal: number;

  @type('number')
  public Status: number;

  @association({collection: 'MediaItem'}) 
  public MediaItems: Array<MediaItem>;

  @association('UploadPictureImageProperty') 
  public ImageProperty: UploadPictureImageProperty;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
    ValidationRules
      .ensure((p: FacetValue) => p.ID_Group)
      .displayName(localize.tr('Facet_Value.Group.DisplayName', { ns: ['Metadata'] }))
      .required()
      .ensure((p: FacetValue) => p.NameGerman)
      .displayName(localize.tr('Facet_Value.Name_German.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(50)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'ID_Group', ValidationSettings.BaseURL + 'CheckFacetValueNameGerman')
      .ensure((p: FacetValue) => p.NameEnglish)
      .displayName(localize.tr('Facet_Value.Name_English.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(50)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'ID_Group', ValidationSettings.BaseURL + 'CheckFacetValueNameEnglish')
      .on(this);
  }
}
