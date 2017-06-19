import { Entity } from '../../Helper/EntityHelper/Entity';
import { MediaItem } from './MediaItem';
import { FacetValue } from "Models/Entities/FacetValue";

export class MediaItemFacet extends Entity {
  public ID: number;
  public ID_MediaItem: number;
  public ID_FacetValue: number;

  public FacetValue: FacetValue;
  public MediaItem: MediaItem;
}
