import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { FacetValue } from './FacetValue';
import { enFacetType } from "Enum/FamilieLaissEnum";
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';

@idProperty('ID')
@name('FacetGroup')
@identifier('FacetGroup')
@resource('facetgroup')
@validation()
@autoinject()
export class FacetGroup extends Entity {
  @type('number')
  public ID: number;

  @type('number')
  public Type: enFacetType;

  @type('string')
  public NameGerman: string;

  @type('string')
  public NameEnglish: string;

  @type('datetime')
  public DDL_Create: Date;

  @association({collection: 'FacetValue'}) 
  public Values: Array<FacetValue>;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
    ValidationRules
      .ensure((p: FacetGroup) => p.Type)
      .displayName(localize.tr('Facet_Group.Type.DisplayName', { ns: ['Metadata'] }))
      .required()
      .ensure((p: FacetGroup) => p.NameGerman)
      .displayName(localize.tr('Facet_Group.Name_German.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(70)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckFacetGroupNameGerman')
      .ensure((p: FacetGroup) => p.NameEnglish)
      .displayName(localize.tr('Facet_Group.Name_English.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(70)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckFacetGroupNameEnglish')
      .on(this);
  }
}
