import { Entity } from '../../Helper/EntityHelper/Entity';
import { UploadPictureItem } from './UploadPictureItem';

export class UploadPictureImageProperty extends Entity {
  public ID: number;
  public Rotate: number;

  public UploadPicture: UploadPictureItem;
}
