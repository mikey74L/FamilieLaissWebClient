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

  private language: string;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Aktuelle Sprache ermitteln
    this.language = localize.i18next.language.substr(0, 2);

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

  //Ermittelt den lokalisierten Namen der Facet-Group
  get localizedName(): string {
    if (this.language === 'de') {
      return this.NameGerman;
    }
    else {
      return this.NameEnglish;
    }
  }
}
