import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { MediaItem } from './MediaItem';

@idProperty('ID')
@name('UploadVideoItem')
@identifier('UploadVideoItem')
@resource('uploadvideoitem')
@validation()
@autoinject()
export class UploadVideoItem extends Entity {
  @type('number')
  public ID: number;

  @type('string')
  public OriginalName: string;

  @type('number')
  public Status: number;

  @type('datetime')
  public UploadDate: Date;  

  @type('number')
  public OriginalHeight: number;

  @type('number')
  public OriginalWidth: number;

  @type('number')
  public DurationHour: number;

  @type('number')
  public DurationMinute: number;

  @type('number')
  public DurationSecond: number;

  @association({collection: 'MediaItem'}) 
  public MediaItems: Array<MediaItem>;

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
