import { MediaItem } from './MediaItem';
import { EntityBase } from './EntityBase';

export class UploadVideoItem extends EntityBase {
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
