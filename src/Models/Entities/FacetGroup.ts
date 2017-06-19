import { Entity } from '../../Helper/EntityHelper/Entity';
import { FacetValue } from './FacetValue';
import { enFacetType } from "Enum/FamilieLaissEnum";

export class FacetGroup extends Entity {

  public ID: number;

  public Type: enFacetType;

  public NameGerman: string;

  public NameEnglish: string;

  public Values: Array<FacetValue>;
}
