import { FacetValueModel } from './FacetValueModel';
import {Entity, EntityAspect, EntityType} from 'breeze-client';

export class FacetGroupModel implements Entity {
  public ID: number;
  public Type: number;
  public NameGerman: string;
  public NameEnglish: string;

  public Values: Array<FacetValueModel>;

  public entityAspect: EntityAspect;
  public entityType: EntityType;
}
