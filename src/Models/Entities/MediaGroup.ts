import { enMediaType } from '../../Enum/FamilieLaissEnum';
import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { MediaItem } from "./MediaItem";

@idProperty('ID')
@name('MediaGroup')
@identifier('MediaGroup')
@resource('mediagroup')
@validation()
@autoinject()
export class MediaGroup extends Entity {
  @type('number')
  public ID: number;
 
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
 
  @type('datetime')
  public DDL_Create: Date;
 
  @association({collection: 'MediaItem'}) 
  public MediaItems: Array<MediaItem>;

  private language: string;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();

    //Aktuelle Sprache ermitteln
    this.language = localize.i18next.language.substr(0, 2);

    //Die Validierungsregeln hinzufügen
    ValidationRules
      .ensure((p: MediaGroup) => p.Type)
      .displayName(localize.tr('Media_Group.Type.DisplayName', { ns: ['Metadata'] }))
      .required()
      .ensure((p: MediaGroup) => p.NameGerman)
      .displayName(localize.tr('Media_Group.Name_German.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(70)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckMediaGroupNameGerman')
      .ensure((p: MediaGroup) => p.NameEnglish)
      .displayName(localize.tr('Media_Group.Name_English.DisplayName', { ns: ['Metadata'] }))
      .required()
      .maxLength(70)
      .then()
      .satisfiesRule('valueAlreadyExists', 'ID', 'Type', ValidationSettings.BaseURL + 'CheckMediaGroupNameEnglish')
      .ensure((p: MediaGroup) => p.DescriptionGerman)
      .displayName(localize.tr('Media_Group.Description_German.DisplayName', { ns: ['Metadata'] }))
      .maxLength(300)
      .ensure((p: MediaGroup) => p.DescriptionEnglish)
      .displayName(localize.tr('Media_Group.Description_English.DisplayName', { ns: ['Metadata'] }))
      .maxLength(300)
      .on(this);
  }

  //Ermittelt den lokalisierten Namen des Album
  get localizedName(): string {
    if (this.language === 'de') {
      return this.NameGerman;
    }
    else {
      return this.NameEnglish;
    }
  }

  //Ermittelt die lokalisierte Beschreibung des Album
  get localizedDescription(): string {
    if (this.language === 'de') {
      return this.DescriptionGerman;
    }
    else {
      return this.DescriptionEnglish;
    }
  }
}
