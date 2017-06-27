import { DropdownListValueItem } from '../Helper/DropDownListHelper';
import { I18N } from 'aurelia-i18n';

export class ExifHelper {
  loc: I18N;

  //C'tor
  constructor (localize: I18N) {
    //Übernehmen der Parameter
    this.loc = localize;
  }

  //Ermittelt den lokalisierten Eintrag über I18N
  private getLocalizedValue(identifier: string, valueNumber: number): string {
    //Deklaration
    let ReturnValue: string = '';

    //Ermitteln des lokalisierten Textes
    ReturnValue = this.loc.tr(identifier + '.Value', { ns: 'Exif', context: valueNumber.toString()});

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für den Blitzlichtmodus
  public getFlashModeValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Flash', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Flash', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(5, this.getLocalizedValue('Flash', 5), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(7, this.getLocalizedValue('Flash', 7), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(9, this.getLocalizedValue('Flash', 9), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(13, this.getLocalizedValue('Flash', 13), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(15, this.getLocalizedValue('Flash', 15), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(16, this.getLocalizedValue('Flash', 16), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(24, this.getLocalizedValue('Flash', 24), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(25, this.getLocalizedValue('Flash', 25), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(29, this.getLocalizedValue('Flash', 29), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(31, this.getLocalizedValue('Flash', 31), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(32, this.getLocalizedValue('Flash', 32), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(65, this.getLocalizedValue('Flash', 65), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(69, this.getLocalizedValue('Flash', 69), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(71, this.getLocalizedValue('Flash', 71), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(73, this.getLocalizedValue('Flash', 73), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(77, this.getLocalizedValue('Flash', 77), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(79, this.getLocalizedValue('Flash', 79), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(89, this.getLocalizedValue('Flash', 89), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(93, this.getLocalizedValue('Flash', 93), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(95, this.getLocalizedValue('Flash', 95), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für den Weißabgleich
  public getWhiteBalanceValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('WhiteBalance', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('WhiteBalance', 1), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefer die lokalisierten Werte für die Schärfe
  public getSharpnessValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Sharpness', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Sharpness', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(2, this.getLocalizedValue('Sharpness', 2), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für den Kontrast
  public getContrastValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Contrast', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Contrast', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(2, this.getLocalizedValue('Contrast', 2), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für die Lichtquelle
  public getLightSourceValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Light', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Light', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(2, this.getLocalizedValue('Light', 2), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(3, this.getLocalizedValue('Light', 3), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(4, this.getLocalizedValue('Light', 4), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(9, this.getLocalizedValue('Light', 9), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(10, this.getLocalizedValue('Light', 10), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(11, this.getLocalizedValue('Light', 11), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(12, this.getLocalizedValue('Light', 12), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(13, this.getLocalizedValue('Light', 13), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(14, this.getLocalizedValue('Light', 14), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(15, this.getLocalizedValue('Light', 15), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(17, this.getLocalizedValue('Light', 17), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(18, this.getLocalizedValue('Light', 18), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(19, this.getLocalizedValue('Light', 19), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(20, this.getLocalizedValue('Light', 20), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(21, this.getLocalizedValue('Light', 21), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(22, this.getLocalizedValue('Light', 22), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(23, this.getLocalizedValue('Light', 23), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(24, this.getLocalizedValue('Light', 24), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(255, this.getLocalizedValue('Light', 255), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für das Belichtungsprogramm
  public getExposureValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Exposure', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Exposure', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(2, this.getLocalizedValue('Exposure', 2), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(3, this.getLocalizedValue('Exposure', 3), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(4, this.getLocalizedValue('Exposure', 4), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(5, this.getLocalizedValue('Exposure', 5), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(6, this.getLocalizedValue('Exposure', 6), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(7, this.getLocalizedValue('Exposure', 7), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(8, this.getLocalizedValue('Exposure', 8), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für die Sättigung
  public getSaturationValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Saturation', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Saturation', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(2, this.getLocalizedValue('Saturation', 2), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }

  //Liefert die lokalisierten Werte für den Messmodus
  public getMeasureValues(): Array<DropdownListValueItem> {
    //Deklaration
    let ReturnValue: Array<DropdownListValueItem> = [];
    let CurrentValue: DropdownListValueItem;

    //Hinzufügen der Items
    CurrentValue = new DropdownListValueItem(0, this.getLocalizedValue('Metering', 0), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(1, this.getLocalizedValue('Metering', 1), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(2, this.getLocalizedValue('Metering', 2), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(3, this.getLocalizedValue('Metering', 3), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(4, this.getLocalizedValue('Metering', 4), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(5, this.getLocalizedValue('Metering', 5), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(6, this.getLocalizedValue('Metering', 6), false, null);
    ReturnValue.push(CurrentValue);
    CurrentValue = new DropdownListValueItem(255, this.getLocalizedValue('Metering', 255), false, null);
    ReturnValue.push(CurrentValue);

    //Funktionsergebnis
    return ReturnValue;
  }
}
