import { Entity, type, idProperty, name, resource, identifier } from 'aurelia-orm';
import { FacetValue } from './FacetValue';
import { enFacetType } from "Enum/FamilieLaissEnum";

@idProperty('ID')
@name('FacetGroup')
@identifier('FacetGroup')
@resource('facetgroup')
export class FacetGroup extends Entity {
  @type('number')
  public ID: number;

  @type('number')
  public Type: enFacetType;

  @type('string')
  public NameGerman: string;

  @type('string')
  public NameEnglish: string;

  // public Values: Array<FacetValue>;
}
