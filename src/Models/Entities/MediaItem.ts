import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { MediaGroup} from './MediaGroup';
import { MediaItemFacet } from './MediaItemFacet';
import { UploadPictureItem } from './UploadPictureItem';
import { UploadVideoItem } from './UploadVideoItem';
import { enMediaType } from '../../Enum/FamilieLaissEnum';

@idProperty('ID')
@name('MediaItem')
@identifier('MediaItem')
@resource('mediaitem')
@validation()
@autoinject()
export class MediaItem extends Entity {
  @type('number')
  public ID: number;

  @type('number')
  public ID_Group: number;

  @type('number')
  public Type: enMediaType;

  @type('string')
  public NameGerman: string;

  @type('string')
  public NameEnglish: string;

  @type('string')
  public DescriptionGerman: string;

  @type('string')
  public DescriptionEnglish: string;

  @type('boolean')
  public OnlyFamily: boolean;

  @type('datetime')
  public CreateDate: Date;

  @type('number')
  public ID_UploadPicture: number;

  @type('number')
  public ID_UploadVideo: number;

  @association('MediaGroup') 
  public MediaGroup: MediaGroup;

  @association({collection: 'MediaItemFacet'}) 
  public MediaItemFacets: Array<MediaItemFacet>;

  @association('UploadPictureItem') 
  public UploadPicture: UploadPictureItem;

  @association('UploadVideoItem') 
  public UploadVideo: UploadVideoItem;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Die Validierungsregeln hinzufügen
    // ValidationRules
    //   .ensure((p: FacetGroup) => p.Type)
    //   .displayName(localize.tr('Facet_Group.Type.DisplayName', { ns: ['Metadata'] }))
    //   .required()
    //   .ensure((p: FacetGroup) => p.NameGerman)
    //   .displayName(localize.tr('Facet_Group.Name_German.DisplayName', { ns: ['Metadata'] }))
    //   .required()
    //   .maxLength(70)
    //   .then()
    //   .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckFacetGroupNameGerman')
    //   .ensure((p: FacetGroup) => p.NameEnglish)
    //   .displayName(localize.tr('Facet_Group.Name_English.DisplayName', { ns: ['Metadata'] }))
    //   .required()
    //   .maxLength(70)
    //   .then()
    //   .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckFacetGroupNameEnglish')
    //   .on(this);
  }
}
