import { EntityBase } from './EntityBase';
import { FacetGroup } from './FacetGroup';
import { MediaItemFacet } from './MediaItemFacet';

export class FacetValue extends EntityBase {
  public ID: number;
  public ID_Group: number;
  public NameGerman: string;
  public NameEnglish: string;
  public DDL_Create: Date;

  public Group: FacetGroup;
  public MediaItemFacets: Array<MediaItemFacet>;
}
