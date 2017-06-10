import { EntityBase } from './EntityBase';
import { FacetValue } from './FacetValue';
import { enFacetType } from "Enum/FamilieLaissEnum";

export class FacetGroup extends EntityBase {
  public ID: number;
  public Type: enFacetType;
  public NameGerman: string;
  public NameEnglish: string;

  public Values: Array<FacetValue>;
}
