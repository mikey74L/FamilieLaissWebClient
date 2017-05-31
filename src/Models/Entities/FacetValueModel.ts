import {Entity, EntityAspect, EntityType} from 'breeze-client';

export class FacetValueModel implements Entity {
  public ID: number;
  public ID_Group: number;
  public NameGerman: string;
  public NameEnglish: string;
  public DDL_Create: Date;

  public entityAspect: EntityAspect;
  public entityType: EntityType;
}
