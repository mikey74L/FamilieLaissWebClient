import { enMediaType } from 'Enum/FamilieLaissEnum';
import { Entity } from '../../Helper/EntityHelper/Entity';
import { MediaItem } from './MediaItem';

export class MediaGroup extends Entity {
  public ID: number;
 
  public Type: enMediaType;
 
  public NameGerman: string;
 
  public NameEnglish: string;
 
  public DescriptionGerman: string;
 
  public DescriptionEnglish: string;
 
  public DDL_Create: Date;

 
  public MediaItems: Array<MediaItem>;
}
