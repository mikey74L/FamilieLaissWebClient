import { Entity } from '../../Helper/EntityHelper/Entity';
import { UploadVideoItem } from './UploadVideoItem';
import { UploadPictureItem } from './UploadPictureItem';
import { MediaItemFacet } from './MediaItemFacet';
import { MediaGroup } from './MediaGroup';
import { enMediaType } from "Enum/FamilieLaissEnum";

export class MediaItem extends Entity {
  public ID: number;
  public ID_Group: number;
  public Type: enMediaType;
  public NameGerman: string;
  public NameEnglish: string;
  public DescriptionGerman: string;
  public DescriptionEnglish: string;
  public OnlyFamily: boolean;
  public CreateDate: Date;
  public ID_UploadPicture: number;
  public ID_UploadVideo: number;

  public MediaGroup: MediaGroup;
  public MediaItemFacets: Array<MediaItemFacet>;
  public UploadPicture: UploadPictureItem;
  public UploadVideo: UploadVideoItem;
}
