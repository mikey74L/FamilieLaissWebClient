import { EntityBase } from './EntityBase';
import { FacetValue } from './FacetValue';

export class FacetGroup extends EntityBase {
  public ID: number;
  public Type: number;
  public NameGerman: string;
  public NameEnglish: string;

  public Values: Array<FacetValue>;
}
