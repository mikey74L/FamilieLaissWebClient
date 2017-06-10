import { EntityBase } from './EntityBase';
import { MediaItem } from './MediaItem';
import {Entity, EntityAspect, EntityType} from 'breeze-client';

export class MediaGroup extends EntityBase {
  public ID: number;
  public Type: number;
  public NameGerman: string;
  public NameEnglish: string;
  public DescriptionGerman: string;
  public DescriptionEnglish: string;
  public DDL_Create: Date;

  public MediaItems: Array<MediaItem>;
}
