import {Entity, EntityAspect, EntityType} from 'breeze-client';

export class MediaGroupModel implements Entity {
  public ID: number;
  public Type: number;
  public NameGerman: string;
  public NameEnglish: string;
  public DescriptionGerman: string;
  public DescriptionEnglish: string;
  public DDL_Create: Date;

  public entityAspect: EntityAspect;
  public entityType: EntityType;
}
