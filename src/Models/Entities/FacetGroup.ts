import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { FacetValue } from './FacetValue';
import { enFacetType } from "Enum/FamilieLaissEnum";
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { inject } from 'aurelia-framework';

@idProperty('ID')
@name('FacetGroup')
@identifier('FacetGroup')
@resource('facetgroup')
@validation()
@inject(CustomValidationRuleHelper)
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

  constructor(rules: CustomValidationRuleHelper) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
    ValidationRules
      .ensure((p: FacetGroup) => p.NameGerman)
      .required()
      .maxLength(70)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', 'http://localhost:51956/api/validation/CheckFacetGroupNameGerman')
      .ensure((p: FacetGroup) => p.NameEnglish)
      .required()
      .maxLength(70)
      .on(this);
  }
}
