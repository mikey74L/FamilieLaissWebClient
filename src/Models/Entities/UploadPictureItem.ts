import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { MediaItem } from './MediaItem';
import { UploadPictureImageProperty } from './UploadPictureImageProperty';
import { UploadPictureItemExif } from './UploadPictureItemExif';
import { enUploadPictureStatus } from '../../Enum/FamilieLaissEnum';

@idProperty('ID')
@name('UploadPictureItem')
@identifier('UploadPictureItem')
@resource('uploadpictureitem')
@validation()
@autoinject()
export class UploadPictureItem extends Entity {
  @type('number')
  public ID: number;

  @type('string')
  public NameOriginal: string;

  @type('datetime')
  public UploadDate: Date;

  @type('number')
  public HeightOriginal: number;

  @type('number')
  public WidthOriginal: number;

  @type('number')
  public Status: enUploadPictureStatus;

  @association({collection: 'MediaItem'}) 
  public MediaItems: Array<MediaItem>;

  @association('UploadPictureImageProperty') 
  public ImageProperty: UploadPictureImageProperty;

  @association('UploadPictureItemExif') 
  public Exif_Data: UploadPictureItemExif;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();
  }
}
