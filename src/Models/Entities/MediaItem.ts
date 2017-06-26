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
    ValidationRules
      .ensure((p: MediaItem) => p.ID_Group)
      .displayName(localize.tr('Media_Item.Group.DisplayName', { ns: ['Metadata'] }))
      .required()
      .ensure((p: MediaItem) => p.Type)
      .displayName(localize.tr('Media_Item.Type.DisplayName', { ns: ['Metadata'] }))
      .required()
      .ensure((p: MediaItem) => p.NameGerman)
      .displayName(localize.tr('Media_Item.Name_German.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(200)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckMediaItemNameGerman')
      .ensure((p: MediaItem) => p.NameEnglish)
      .displayName(localize.tr('Media_Item.Name_English.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(200)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckMediaItemNameEnglish')
      .ensure((p: MediaItem) => p.DescriptionGerman)
      .displayName(localize.tr('Media_Item.Description_German.DisplayName', { ns: ['Metadata'] }))
      .maxLength(2000)
      .ensure((p: MediaItem) => p.DescriptionEnglish)
      .displayName(localize.tr('Media_Item.Description_English.DisplayName', { ns: ['Metadata'] }))
      .maxLength(2000)
      .ensure((p: MediaItem) => p.OnlyFamily)
      .displayName(localize.tr('Media_Item.Only_Family.DisplayName', { ns: ['Metadata'] }))
      .required()
      .ensure((p: MediaItem) => p.ID_UploadPicture)
      .displayName(localize.tr('Media_Item.Picture.DisplayName', { ns: ['Metadata'] }))
      .required()
         .when((p: MediaItem) => p.Type === enMediaType.Picture)
      .ensure((p: MediaItem) => p.ID_UploadVideo)
      .displayName(localize.tr('Media_Item.Video.DisplayName', { ns: ['Metadata'] }))
      .required()
         .when((p: MediaItem) => p.Type === enMediaType.Video)
      .on(this);
  }
}
