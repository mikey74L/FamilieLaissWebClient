import { MediaItem } from './MediaItem';
import { Entity } from '../../Helper/EntityHelper/Entity';

export class UploadVideoItem extends Entity {
  public ID: number;
  public OriginalName: string;
  public Status: number;
  public UploadDate: Date;  
  public OriginalHeight: number;
  public OriginalWidth: number;
  public DurationHour: number;
  public DurationMinute: number;
  public DurationSecond: number;

  public MediaItems: Array<MediaItem>;
}
