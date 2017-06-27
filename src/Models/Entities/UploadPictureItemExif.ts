import { I18N } from 'aurelia-i18n';
import { ValidationSettings } from './../../Config/ValidationSettings';
import { Entity, type, idProperty, name, resource, identifier, association, validation } from 'aurelia-orm';
import { ValidationRules } from 'aurelia-validation';
import { CustomValidationRuleHelper } from './../../Helper/CustomValidationRuleHelper';
import { autoinject } from 'aurelia-framework';
import { UploadPictureItem } from './UploadPictureItem';

@idProperty('ID')
@name('UploadPictureItemExif')
@identifier('UploadPictureItemExif')
@resource('uploadpictureitemexif')
@validation()
@autoinject()
export class UploadPictureItemExif extends Entity {
  @type('number')
  public ID: number;

  public Make: string;

  public Model: string;

  public Resolution_X: number;

  public Resolution_Y: number;

  public Resolution_Unit: string;

  public Orientation: number;

  public DDL_Recorded: Date;

  public Exposure_Time: number;

  public Exposure_Programm: number;

  public Exposure_Mode: number;

  public F_Number: number;

  public ISO_Sensitivity: number;

  public Shutter_Speed: number;

  public Metering_Mode: number;

  public Flash_Mode: number;

  public Focal_Length: number;

  public Sensing_Mode: number;

  public White_Balance_Mode: number;

  public Sharpness: number;

  public GPS_Location:

  @association('UploadPictureItem') 
  public UploadPicture: UploadPictureItem;

  constructor(rules: CustomValidationRuleHelper, localize: I18N) {
    //Den Vater-Konstruktor aufrufen
    super();
  }
}
