import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { FacetGroup } from './FacetGroup';
import { MediaItemFacet } from './MediaItemFacet';
import { enFacetType } from "Enum/FamilieLaissEnum";
import { ValidationRules } from 'aurelia-validation';

@idProperty('ID')
@name('FacetValue')
@identifier('FacetValue')
@resource('facetvalue')
@validation()
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

  constructor() {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
  }
}
