import { EntityBase } from './EntityBase';
import { MediaItem } from './MediaItem';
import { UploadPictureImageProperty } from "Models/Entities/UploadPictureImageProperty";

export class UploadPictureItem extends EntityBase {
  public ID: number;
  public NameOriginal: string;
  public UploadDate: Date;
  public HeightOriginal: number;
  public WidthOriginal: number;
  public Status: number;

  public MediaItems: Array<MediaItem>;
  public ImageProperty: UploadPictureImageProperty;
}
