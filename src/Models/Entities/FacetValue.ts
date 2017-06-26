import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { enFacetType } from "Enum/FamilieLaissEnum";
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { FacetGroup } from './FacetGroup';
import { MediaItemFacet } from './MediaItemFacet';

@idProperty('ID')
@name('FacetValue')
@identifier('FacetValue')
@resource('facetvalue')
@validation()
@autoinject()
export class FacetValue extends Entity {
  @type('number')
  public ID: number;

  @type('number')
  public ID_Group: number;
  
  @type('string')
  public NameGerman: string;
  
  @type('string')
  public NameEnglish: string;
  
  @type('datetime')
  public DDL_Create: Date;

  @association('FacetGroup') 
  public Group: FacetGroup;
  
  @association({collection: 'MediaItemFacet'}) 
  public MediaItemFacets: Array<MediaItemFacet>;

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

  get localizedName(): string {
    return "";
  }
}
