import { EntityBase } from './EntityBase';
import { UploadPictureItem } from './UploadPictureItem';

export class UploadPictureImageProperty extends EntityBase {
  public ID: number;
  public Rotate: number;

  public UploadPicture: UploadPictureItem;
}
