import { ForgotPasswordDTO } from './../Models/Auth/DTO/ForgotPasswordDTO';
import { ForgotPasswordModel } from '../Models/Auth/ForgotPasswordModel';
import { LoginDTO } from '../Models/Auth/DTO/LoginDTO';
import { RegisterUserDTO } from '../Models/Auth/DTO/RegisterUserDTO';
import { RegisterModel } from '../Models/Auth/RegisterModel';
import { SessionCache } from './SessionCache';
import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, singleton } from 'aurelia-framework';
import { LoginModel } from '../Models/Auth/LoginModel';
import { RouteConfigAuth } from '../Config/RouteConfigAuth';
import { DropdownListData, DropdownListGroupItem } from '../Helper/DropDownListHelper';
import { UserInfo } from '../Models/Auth/UserInfo';
import { UserInfoChangedEvent } from '../Events/AuthEvents';

@autoinject()
@singleton()
export class AuthorizationHelper {
  //Member
  private loc: I18N;
  private client: HttpClient;
  private eventAggregator: EventAggregator;

  private userInfo: UserInfo;

  //C'tor
  constructor (localize: I18N, eventAggregator: EventAggregator, client: HttpClient) {
    //Übernehmen der Parameter
    this.loc = localize;
    this.eventAggregator = eventAggregator;
    this.client = client;

    //Ermitteln ob es ein Token im Session oder Local Storage gibt
    let AuthHeader = this.getAuthHeader();

    //Ermitteln der Benutzerinfo vom Server
    if (AuthHeader != null) {
      this.getUserInfoFromServer()
        .then(message => {
          //Wandeln des Json-Strings in ein Object
          var Result = $.parseJSON(message.response);

          //Übernehmen des Vorname und Familienname
          if (Result != null) {
            //Setzen der aktuellen User-Info
            this.userInfo = new UserInfo(Result.userName, Result.firstName, Result.familyName, Result.roles);
          }
          else {
            this.userInfo = null;
          }
        })
        .catch(reason => {
          this.userInfo = null;
        })
    }
  }

  //Zurückliefern der Liste der Sicherheitsfragen für das Dropdown
  public getSecurityQuestionList(): DropdownListData {
    //Befüllen der Liste der Security-Questions mit den lokalisierten Fragen
    let securityQuestionList: DropdownListData = new DropdownListData(false);
    let Group: DropdownListGroupItem = securityQuestionList.addGroup(0, 'Pseudo');
    Group.addValue(1, this.loc.tr('Question_1', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(2, this.loc.tr('Question_2', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(3, this.loc.tr('Question_3', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(4, this.loc.tr('Question_4', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(5, this.loc.tr('Question_5', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(6, this.loc.tr('Question_6', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(7, this.loc.tr('Question_7', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(8, this.loc.tr('Question_8', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(9, this.loc.tr('Question_9', {ns: 'SecurityQuestions'}), false, null);
    Group.addValue(10, this.loc.tr('Question_10', {ns: 'SecurityQuestions'}), false, null);
    securityQuestionList.setValue(1, true);

    //Funktionsergebnis
    return securityQuestionList;
  }

  //Zurückliefern der Liste der Geschlechter für das Dropdown
  public getGenderList(): DropdownListData {
    //Befüllen der Liste der Geschlechter mit den lokalisierten Geschlechtern
    let genderList: DropdownListData = new DropdownListData(false);
    let Group: DropdownListGroupItem = genderList.addGroup(0, 'Pseudo');
    Group.addValue(1, this.loc.tr('Gender.Male', {ns: 'AuthRegister'}), false, null);
    Group.addValue(2, this.loc.tr('Gender.Female', {ns: 'AuthRegister'}), false, null);
    genderList.setValue(1, true);

    //Funktionsergebnis
    return genderList;
  }

  //Zurückliefern der Liste der Länder für das Dropdown
  public getCountryList(): DropdownListData {
    //Befüllen der Liste der Länder mit den lokalisierten Ländern
    let countryList: DropdownListData = new DropdownListData(false);
    let Group: DropdownListGroupItem = countryList.addGroup(0, 'Pseudo');
    Group = countryList.addGroup(0, 'Pseudo');
    Group.addValue('AF', this.loc.tr('AF', {ns: 'Countries'}), false, null);
    Group.addValue('AL', this.loc.tr('AL', {ns: 'Countries'}), false, null);
    Group.addValue('DZ', this.loc.tr('DZ', {ns: 'Countries'}), false, null);
    Group.addValue('AD', this.loc.tr('AD', {ns: 'Countries'}), false, null);
    Group.addValue('AO', this.loc.tr('AO', {ns: 'Countries'}), false, null);
    Group.addValue('AI', this.loc.tr('AI', {ns: 'Countries'}), false, null);
    Group.addValue('AG', this.loc.tr('AG', {ns: 'Countries'}), false, null);
    Group.addValue('AR', this.loc.tr('AR', {ns: 'Countries'}), false, null);
    Group.addValue('AM', this.loc.tr('AM', {ns: 'Countries'}), false, null);
    Group.addValue('AW', this.loc.tr('AW', {ns: 'Countries'}), false, null);
    Group.addValue('AU', this.loc.tr('AU', {ns: 'Countries'}), false, null);
    Group.addValue('AT', this.loc.tr('AT', {ns: 'Countries'}), false, null);
    Group.addValue('AZ', this.loc.tr('AZ', {ns: 'Countries'}), false, null);
    Group.addValue('BS', this.loc.tr('BS', {ns: 'Countries'}), false, null);
    Group.addValue('BH', this.loc.tr('BH', {ns: 'Countries'}), false, null);
    Group.addValue('BD', this.loc.tr('BD', {ns: 'Countries'}), false, null);
    Group.addValue('BB', this.loc.tr('BB', {ns: 'Countries'}), false, null);
    Group.addValue('BY', this.loc.tr('BY', {ns: 'Countries'}), false, null);
    Group.addValue('BE', this.loc.tr('BE', {ns: 'Countries'}), false, null);
    Group.addValue('BZ', this.loc.tr('BZ', {ns: 'Countries'}), false, null);
    Group.addValue('BJ', this.loc.tr('BJ', {ns: 'Countries'}), false, null);
    Group.addValue('BM', this.loc.tr('BM', {ns: 'Countries'}), false, null);
    Group.addValue('BT', this.loc.tr('BT', {ns: 'Countries'}), false, null);
    Group.addValue('BO', this.loc.tr('BO', {ns: 'Countries'}), false, null);
    Group.addValue('BQ', this.loc.tr('BQ', {ns: 'Countries'}), false, null);
    Group.addValue('BA', this.loc.tr('BA', {ns: 'Countries'}), false, null);
    Group.addValue('BW', this.loc.tr('BW', {ns: 'Countries'}), false, null);
    Group.addValue('BV', this.loc.tr('BV', {ns: 'Countries'}), false, null);
    Group.addValue('BR', this.loc.tr('BR', {ns: 'Countries'}), false, null);
    Group.addValue('BN', this.loc.tr('BN', {ns: 'Countries'}), false, null);
    Group.addValue('BG', this.loc.tr('BG', {ns: 'Countries'}), false, null);
    Group.addValue('BF', this.loc.tr('BF', {ns: 'Countries'}), false, null);
    Group.addValue('BI', this.loc.tr('BI', {ns: 'Countries'}), false, null);
    Group.addValue('KH', this.loc.tr('KH', {ns: 'Countries'}), false, null);
    Group.addValue('CM', this.loc.tr('CM', {ns: 'Countries'}), false, null);
    Group.addValue('CA', this.loc.tr('CA', {ns: 'Countries'}), false, null);
    Group.addValue('CV', this.loc.tr('CV', {ns: 'Countries'}), false, null);
    Group.addValue('KY', this.loc.tr('KY', {ns: 'Countries'}), false, null);
    Group.addValue('CF', this.loc.tr('CF', {ns: 'Countries'}), false, null);
    Group.addValue('TD', this.loc.tr('TD', {ns: 'Countries'}), false, null);
    Group.addValue('CL', this.loc.tr('CL', {ns: 'Countries'}), false, null);
    Group.addValue('CN', this.loc.tr('CN', {ns: 'Countries'}), false, null);
    Group.addValue('CO', this.loc.tr('CO', {ns: 'Countries'}), false, null);
    Group.addValue('KM', this.loc.tr('KM', {ns: 'Countries'}), false, null);
    Group.addValue('CG', this.loc.tr('CG', {ns: 'Countries'}), false, null);
    Group.addValue('CK', this.loc.tr('CK', {ns: 'Countries'}), false, null);
    Group.addValue('CR', this.loc.tr('CR', {ns: 'Countries'}), false, null);
    Group.addValue('CI', this.loc.tr('CI', {ns: 'Countries'}), false, null);
    Group.addValue('HR', this.loc.tr('HR', {ns: 'Countries'}), false, null);
    Group.addValue('CU', this.loc.tr('CU', {ns: 'Countries'}), false, null);
    Group.addValue('CW', this.loc.tr('CW', {ns: 'Countries'}), false, null);
    Group.addValue('CY', this.loc.tr('CY', {ns: 'Countries'}), false, null);
    Group.addValue('CZ', this.loc.tr('CZ', {ns: 'Countries'}), false, null);
    Group.addValue('KP', this.loc.tr('KP', {ns: 'Countries'}), false, null);
    Group.addValue('LA', this.loc.tr('LA', {ns: 'Countries'}), false, null);
    Group.addValue('CD', this.loc.tr('CD', {ns: 'Countries'}), false, null);
    Group.addValue('DK', this.loc.tr('DK', {ns: 'Countries'}), false, null);
    Group.addValue('DJ', this.loc.tr('DJ', {ns: 'Countries'}), false, null);
    Group.addValue('DM', this.loc.tr('DM', {ns: 'Countries'}), false, null);
    Group.addValue('DO', this.loc.tr('DO', {ns: 'Countries'}), false, null);
    Group.addValue('EC', this.loc.tr('EC', {ns: 'Countries'}), false, null);
    Group.addValue('EG', this.loc.tr('EG', {ns: 'Countries'}), false, null);
    Group.addValue('SV', this.loc.tr('SV', {ns: 'Countries'}), false, null);
    Group.addValue('GQ', this.loc.tr('GQ', {ns: 'Countries'}), false, null);
    Group.addValue('ER', this.loc.tr('ER', {ns: 'Countries'}), false, null);
    Group.addValue('EE', this.loc.tr('EE', {ns: 'Countries'}), false, null);
    Group.addValue('ET', this.loc.tr('ET', {ns: 'Countries'}), false, null);
    Group.addValue('FK', this.loc.tr('FK', {ns: 'Countries'}), false, null);
    Group.addValue('FO', this.loc.tr('FO', {ns: 'Countries'}), false, null);
    Group.addValue('FJ', this.loc.tr('FJ', {ns: 'Countries'}), false, null);
    Group.addValue('FI', this.loc.tr('FI', {ns: 'Countries'}), false, null);
    Group.addValue('FR', this.loc.tr('FR', {ns: 'Countries'}), false, null);
    Group.addValue('GA', this.loc.tr('GA', {ns: 'Countries'}), false, null);
    Group.addValue('GM', this.loc.tr('GM', {ns: 'Countries'}), false, null);
    Group.addValue('GE', this.loc.tr('GE', {ns: 'Countries'}), false, null);
    Group.addValue('DE', this.loc.tr('DE', {ns: 'Countries'}), false, null);
    Group.addValue('GH', this.loc.tr('GH', {ns: 'Countries'}), false, null);
    Group.addValue('GI', this.loc.tr('GI', {ns: 'Countries'}), false, null);
    Group.addValue('GR', this.loc.tr('GR', {ns: 'Countries'}), false, null);
    Group.addValue('GL', this.loc.tr('GL', {ns: 'Countries'}), false, null);
    Group.addValue('GD', this.loc.tr('GD', {ns: 'Countries'}), false, null);
    Group.addValue('GT', this.loc.tr('GT', {ns: 'Countries'}), false, null);
    Group.addValue('GG', this.loc.tr('GG', {ns: 'Countries'}), false, null);
    Group.addValue('GN', this.loc.tr('GN', {ns: 'Countries'}), false, null);
    Group.addValue('GW', this.loc.tr('GW', {ns: 'Countries'}), false, null);
    Group.addValue('GY', this.loc.tr('GY', {ns: 'Countries'}), false, null);
    Group.addValue('HT', this.loc.tr('HT', {ns: 'Countries'}), false, null);
    Group.addValue('VA', this.loc.tr('VA', {ns: 'Countries'}), false, null);
    Group.addValue('HN', this.loc.tr('HN', {ns: 'Countries'}), false, null);
    Group.addValue('HU', this.loc.tr('HU', {ns: 'Countries'}), false, null);
    Group.addValue('IS', this.loc.tr('IS', {ns: 'Countries'}), false, null);
    Group.addValue('IN', this.loc.tr('IN', {ns: 'Countries'}), false, null);
    Group.addValue('ID', this.loc.tr('ID', {ns: 'Countries'}), false, null);
    Group.addValue('IR', this.loc.tr('IR', {ns: 'Countries'}), false, null);
    Group.addValue('IQ', this.loc.tr('IQ', {ns: 'Countries'}), false, null);
    Group.addValue('IE', this.loc.tr('IE', {ns: 'Countries'}), false, null);
    Group.addValue('IM', this.loc.tr('IM', {ns: 'Countries'}), false, null);
    Group.addValue('IL', this.loc.tr('IL', {ns: 'Countries'}), false, null);
    Group.addValue('IT', this.loc.tr('IT', {ns: 'Countries'}), false, null);
    Group.addValue('JM', this.loc.tr('JM', {ns: 'Countries'}), false, null);
    Group.addValue('JP', this.loc.tr('JP', {ns: 'Countries'}), false, null);
    Group.addValue('JE', this.loc.tr('JE', {ns: 'Countries'}), false, null);
    Group.addValue('JO', this.loc.tr('JO', {ns: 'Countries'}), false, null);
    Group.addValue('KZ', this.loc.tr('KZ', {ns: 'Countries'}), false, null);
    Group.addValue('KE', this.loc.tr('KE', {ns: 'Countries'}), false, null);
    Group.addValue('KI', this.loc.tr('KI', {ns: 'Countries'}), false, null);
    Group.addValue('KW', this.loc.tr('KW', {ns: 'Countries'}), false, null);
    Group.addValue('KG', this.loc.tr('KG', {ns: 'Countries'}), false, null);
    Group.addValue('LV', this.loc.tr('LV', {ns: 'Countries'}), false, null);
    Group.addValue('LB', this.loc.tr('LB', {ns: 'Countries'}), false, null);
    Group.addValue('LS', this.loc.tr('LS', {ns: 'Countries'}), false, null);
    Group.addValue('LR', this.loc.tr('LR', {ns: 'Countries'}), false, null);
    Group.addValue('LY', this.loc.tr('LY', {ns: 'Countries'}), false, null);
    Group.addValue('LI', this.loc.tr('LI', {ns: 'Countries'}), false, null);
    Group.addValue('LT', this.loc.tr('LT', {ns: 'Countries'}), false, null);
    Group.addValue('LU', this.loc.tr('LU', {ns: 'Countries'}), false, null);
    Group.addValue('MO', this.loc.tr('MO', {ns: 'Countries'}), false, null);
    Group.addValue('MG', this.loc.tr('MG', {ns: 'Countries'}), false, null);
    Group.addValue('MW', this.loc.tr('MW', {ns: 'Countries'}), false, null);
    Group.addValue('MY', this.loc.tr('MY', {ns: 'Countries'}), false, null);
    Group.addValue('MV', this.loc.tr('MV', {ns: 'Countries'}), false, null);
    Group.addValue('ML', this.loc.tr('ML', {ns: 'Countries'}), false, null);
    Group.addValue('MT', this.loc.tr('MT', {ns: 'Countries'}), false, null);
    Group.addValue('MR', this.loc.tr('MR', {ns: 'Countries'}), false, null);
    Group.addValue('MU', this.loc.tr('MU', {ns: 'Countries'}), false, null);
    Group.addValue('MX', this.loc.tr('MX', {ns: 'Countries'}), false, null);
    Group.addValue('MC', this.loc.tr('MC', {ns: 'Countries'}), false, null);
    Group.addValue('MN', this.loc.tr('MN', {ns: 'Countries'}), false, null);
    Group.addValue('ME', this.loc.tr('ME', {ns: 'Countries'}), false, null);
    Group.addValue('MS', this.loc.tr('MS', {ns: 'Countries'}), false, null);
    Group.addValue('MA', this.loc.tr('MA', {ns: 'Countries'}), false, null);
    Group.addValue('MZ', this.loc.tr('MZ', {ns: 'Countries'}), false, null);
    Group.addValue('MM', this.loc.tr('MM', {ns: 'Countries'}), false, null);
    Group.addValue('NA', this.loc.tr('NA', {ns: 'Countries'}), false, null);
    Group.addValue('NR', this.loc.tr('NR', {ns: 'Countries'}), false, null);
    Group.addValue('NP', this.loc.tr('NP', {ns: 'Countries'}), false, null);
    Group.addValue('NL', this.loc.tr('NL', {ns: 'Countries'}), false, null);
    Group.addValue('NZ', this.loc.tr('NZ', {ns: 'Countries'}), false, null);
    Group.addValue('NI', this.loc.tr('NI', {ns: 'Countries'}), false, null);
    Group.addValue('NE', this.loc.tr('NE', {ns: 'Countries'}), false, null);
    Group.addValue('NG', this.loc.tr('NG', {ns: 'Countries'}), false, null);
    Group.addValue('MP', this.loc.tr('MP', {ns: 'Countries'}), false, null);
    Group.addValue('NO', this.loc.tr('NO', {ns: 'Countries'}), false, null);
    Group.addValue('OM', this.loc.tr('OM', {ns: 'Countries'}), false, null);
    Group.addValue('PK', this.loc.tr('PK', {ns: 'Countries'}), false, null);
    Group.addValue('PW', this.loc.tr('PW', {ns: 'Countries'}), false, null);
    Group.addValue('PA', this.loc.tr('PA', {ns: 'Countries'}), false, null);
    Group.addValue('PG', this.loc.tr('PG', {ns: 'Countries'}), false, null);
    Group.addValue('PY', this.loc.tr('PY', {ns: 'Countries'}), false, null);
    Group.addValue('PE', this.loc.tr('PE', {ns: 'Countries'}), false, null);
    Group.addValue('PH', this.loc.tr('PH', {ns: 'Countries'}), false, null);
    Group.addValue('PL', this.loc.tr('PL', {ns: 'Countries'}), false, null);
    Group.addValue('PT', this.loc.tr('PT', {ns: 'Countries'}), false, null);
    Group.addValue('QA', this.loc.tr('QA', {ns: 'Countries'}), false, null);
    Group.addValue('KR', this.loc.tr('KR', {ns: 'Countries'}), false, null);
    Group.addValue('MD', this.loc.tr('MD', {ns: 'Countries'}), false, null);
    Group.addValue('RO', this.loc.tr('RO', {ns: 'Countries'}), false, null);
    Group.addValue('RU', this.loc.tr('RU', {ns: 'Countries'}), false, null);
    Group.addValue('RW', this.loc.tr('RW', {ns: 'Countries'}), false, null);
    Group.addValue('SH', this.loc.tr('SH', {ns: 'Countries'}), false, null);
    Group.addValue('KN', this.loc.tr('KN', {ns: 'Countries'}), false, null);
    Group.addValue('LC', this.loc.tr('LC', {ns: 'Countries'}), false, null);
    Group.addValue('VC', this.loc.tr('VC', {ns: 'Countries'}), false, null);
    Group.addValue('WS', this.loc.tr('WS', {ns: 'Countries'}), false, null);
    Group.addValue('SM', this.loc.tr('SM', {ns: 'Countries'}), false, null);
    Group.addValue('ST', this.loc.tr('ST', {ns: 'Countries'}), false, null);
    Group.addValue('SA', this.loc.tr('SA', {ns: 'Countries'}), false, null);
    Group.addValue('SN', this.loc.tr('SN', {ns: 'Countries'}), false, null);
    Group.addValue('RS', this.loc.tr('RS', {ns: 'Countries'}), false, null);
    Group.addValue('SC', this.loc.tr('SC', {ns: 'Countries'}), false, null);
    Group.addValue('SL', this.loc.tr('SL', {ns: 'Countries'}), false, null);
    Group.addValue('SG', this.loc.tr('SG', {ns: 'Countries'}), false, null);
    Group.addValue('SX', this.loc.tr('SX', {ns: 'Countries'}), false, null);
    Group.addValue('SK', this.loc.tr('SK', {ns: 'Countries'}), false, null);
    Group.addValue('SI', this.loc.tr('SI', {ns: 'Countries'}), false, null);
    Group.addValue('SB', this.loc.tr('SB', {ns: 'Countries'}), false, null);
    Group.addValue('SO', this.loc.tr('SO', {ns: 'Countries'}), false, null);
    Group.addValue('ZA', this.loc.tr('ZA', {ns: 'Countries'}), false, null);
    Group.addValue('GS', this.loc.tr('GS', {ns: 'Countries'}), false, null);
    Group.addValue('SS', this.loc.tr('SS', {ns: 'Countries'}), false, null);
    Group.addValue('ES', this.loc.tr('ES', {ns: 'Countries'}), false, null);
    Group.addValue('LK', this.loc.tr('LK', {ns: 'Countries'}), false, null);
    Group.addValue('SD', this.loc.tr('SD', {ns: 'Countries'}), false, null);
    Group.addValue('SR', this.loc.tr('SR', {ns: 'Countries'}), false, null);
    Group.addValue('SZ', this.loc.tr('SZ', {ns: 'Countries'}), false, null);
    Group.addValue('SE', this.loc.tr('SE', {ns: 'Countries'}), false, null);
    Group.addValue('CH', this.loc.tr('CH', {ns: 'Countries'}), false, null);
    Group.addValue('SY', this.loc.tr('SY', {ns: 'Countries'}), false, null);
    Group.addValue('TW', this.loc.tr('TW', {ns: 'Countries'}), false, null);
    Group.addValue('TJ', this.loc.tr('TJ', {ns: 'Countries'}), false, null);
    Group.addValue('TH', this.loc.tr('TH', {ns: 'Countries'}), false, null);
    Group.addValue('MK', this.loc.tr('MK', {ns: 'Countries'}), false, null);
    Group.addValue('HK', this.loc.tr('HK', {ns: 'Countries'}), false, null);
    Group.addValue('TL', this.loc.tr('TL', {ns: 'Countries'}), false, null);
    Group.addValue('TG', this.loc.tr('TG', {ns: 'Countries'}), false, null);
    Group.addValue('TO', this.loc.tr('TO', {ns: 'Countries'}), false, null);
    Group.addValue('TT', this.loc.tr('TT', {ns: 'Countries'}), false, null);
    Group.addValue('TN', this.loc.tr('TN', {ns: 'Countries'}), false, null);
    Group.addValue('TR', this.loc.tr('TR', {ns: 'Countries'}), false, null);
    Group.addValue('TM', this.loc.tr('TM', {ns: 'Countries'}), false, null);
    Group.addValue('TC', this.loc.tr('TC', {ns: 'Countries'}), false, null);
    Group.addValue('TV', this.loc.tr('TV', {ns: 'Countries'}), false, null);
    Group.addValue('UG', this.loc.tr('UG', {ns: 'Countries'}), false, null);
    Group.addValue('UA', this.loc.tr('UA', {ns: 'Countries'}), false, null);
    Group.addValue('AE', this.loc.tr('AE', {ns: 'Countries'}), false, null);
    Group.addValue('GB', this.loc.tr('GB', {ns: 'Countries'}), false, null);
    Group.addValue('TZ', this.loc.tr('TZ', {ns: 'Countries'}), false, null);
    Group.addValue('US', this.loc.tr('US', {ns: 'Countries'}), false, null);
    Group.addValue('UY', this.loc.tr('UY', {ns: 'Countries'}), false, null);
    Group.addValue('UZ', this.loc.tr('UZ', {ns: 'Countries'}), false, null);
    Group.addValue('VU', this.loc.tr('VU', {ns: 'Countries'}), false, null);
    Group.addValue('VE', this.loc.tr('VE', {ns: 'Countries'}), false, null);
    Group.addValue('VN', this.loc.tr('VN', {ns: 'Countries'}), false, null);
    Group.addValue('VG', this.loc.tr('VG', {ns: 'Countries'}), false, null);
    Group.addValue('EH', this.loc.tr('EH', {ns: 'Countries'}), false, null);
    Group.addValue('YE', this.loc.tr('YE', {ns: 'Countries'}), false, null);
    Group.addValue('ZM', this.loc.tr('ZM', {ns: 'Countries'}), false, null);
    Group.addValue('ZW', this.loc.tr('ZW', {ns: 'Countries'}), false, null);
    countryList.setValue('AF', true);

    //Funktionsergebnis
    return countryList;
  }

  //Setzen der Auth-Info
  public setAuthInfo(userName: string, firstName: string, familyName: string, roles: string, accessToken: string, persistent: boolean): void {
    //Speichern des Tokens im Cache
    if (accessToken) {
      SessionCache.saveAccessToken(accessToken, persistent);
    }

    //Setzen der User-Info
    this.userInfo = new UserInfo(userName, firstName, familyName, roles);
    this.eventAggregator.publish(new UserInfoChangedEvent(this.userInfo));
  }

  //Zusammenstellen des Bearer-Tokens
  private getAuthHeader(): string {
    //Token aus dem Storage ermitteln
    let accessToken = SessionCache.getAccessToken();

    //Aufbereiten des Tokens so dass es vom Server akzeptiert wird
    if (accessToken) {
      return `Bearer ${accessToken}`;
    }
    return null;
  }

  //Authentication-Info entfernen
  private clearAuthInfo(): void {
    //Token aus dem Storage entfernen
    SessionCache.removeAccessToken();

    //Setzen der Benutzerinfo auf NULL
    this.userInfo = null;
  }

  //Ermittelt ob aktuell ein Benutzer angemeldet ist
  public isLoggedIn(): boolean {
    if (this.userInfo === null) {
      return false;
    }
    else {
      return true;
    }
  }

  //Überprüfen ob der angemeldete Benutzer Mitglied der Rolle / Rollen ist
  public isUserInRole(roles: Array<string>): boolean {
    //Wenn keine Rollen angegeben wurden dann ist das Ergegbnis wahr
    if (roles.length == 0) return true;

    //Wenn keine UserInfo vorliegt, dann ist das Ergebnis falsch
    if (this.userInfo == null) return false;

    //Deklaration
    let isInRole = false;

    //Überprüfen ob sich der User der angegebenen Rolle zugeordnet ist
    for (var roleToCheck of roles) {
      if (this.userInfo.roles.indexOf(roleToCheck) !== -1) isInRole = true;
    }

    //Funktionsergebnis
    return isInRole;
  }

  //Ermitteln der Benutzerinfo vom Server
  public getUserInfoFromServer(): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getUserInfoRoute())
      .asGet()
      .withHeader('Authorization', this.getAuthHeader())
      .send();
  }

  //User anmelden (Wird über die Login-Maske aufgerufen)
  public login(model: LoginModel): Promise<HttpResponseMessage> {
    //Deklaration
    let DTO: LoginDTO = new LoginDTO();

    //Übernehmen der Daten in das DTO
    DTO.UserName = model.userName;
    DTO.Password = model.password;
    DTO.grant_type = 'password';

    //Server kontaktieren
    return this.client
      .createRequest(RouteConfigAuth.getLoginRoute())
      .asPost()
      .withContent($.param(DTO))
      .withHeader('Content-Type', 'application/x-www-form-urlencoded')
      .send();
  }

  //Neuen User registrieren (Wird über die Registrierungsmaske aufgerufen)
  public register(data: RegisterModel): Promise<HttpResponseMessage> {
    //Deklaration
    let DTO: RegisterUserDTO = new RegisterUserDTO();

    //Übernehmen der Daten in das DTO
    DTO.UserName = data.userName;
    DTO.eMail = data.eMail;
    DTO.Password = data.password;
    DTO.Gender = data.gender;
    DTO.FirstName = data.firstName;
    DTO.FamilyName = data.familyName;
    DTO.Street = data.street;
    DTO.HNR = data.HNR;
    DTO.PLZ = data.PLZ;
    DTO.City = data.city;
    DTO.Country = data.country;
    DTO.SecurityQuestion = data.securityQuestion;
    DTO.SecurityAnswer = data.securityAnswer;

    //Server kontaktieren
    return this.client
      .createRequest(RouteConfigAuth.getRegisterRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withContent(JSON.stringify(DTO))
      .send();
  }

  //Reset Password (Wird über den Forgot-Password Maske aufgerufen)
  public resetPassword(data: ForgotPasswordModel): Promise <HttpResponseMessage> {
    //Deklaration
    let DTO: ForgotPasswordDTO = new ForgotPasswordDTO();

    //Übernehmen der Daten in das DTO
    DTO.eMail = data.eMail;
    DTO.SecurityQuestion = data.securityQuestion;
    DTO.SecurityAnswer = data.securityAnswer;

    //Server kontaktieren
    return this.client
      .createRequest(RouteConfigAuth.getResetPasswordRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withContent(JSON.stringify(DTO))
      .send();
  }

  //Den User abmelden
  public async logout(): Promise<HttpResponseMessage> {
    //Ermitteln des Auth-Headers mit dem Bearer-Token
    let authHeader = this.getAuthHeader();

    //Den Logout auf dem Server durchführen. Da es bei Token-Authentication keinen
    //wirklichen Logout gibt, werden hier ein paar obligatorische Sachen und Logging
    //auf dem Server durchgeführt
    try {
      let Result = await this.client
        .createRequest(RouteConfigAuth.getLogoutRoute())
        .asPost()
        .withHeader('Authorization', authHeader)
        .send();

        //Das Token aus dem Storage entfernen
        this.clearAuthInfo();

        //Das erfolgreiche Promise zurückliefern
        return Promise.resolve(Result);
    }
    catch (ex) {
      //Das Token aus dem Storage entfernen, auch wenn es einen Fehler auf dem Server
      //gegeben hat. Damit muss sich der User auf jeden Fall frisch anmelden.
      this.clearAuthInfo();

      throw ex;
    }
  }

  //Den Account bestätigen (eMail)
  public confirmAccount(data): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getConfirmAccountRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withContent(JSON.stringify(
          {
              UserName : data.userName,
              Token: data.token,
          }))
      .send()
    }

  //Freischalten des Accounts
  public allowAccount(userName): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getAllowAccountRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', this.getAuthHeader())
      .withContent(JSON.stringify(
          {
              UserName : userName
          }))
      .send()
    }

  //Sperren des Accounts
  public lockAccount(userName): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getLockAccountRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', this.getAuthHeader())
      .withContent(JSON.stringify(
          {
              UserName : userName
          }))
      .send()
    }

  //Löschen eines Accounts
  public deleteAccount(userName): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getDeleteAccountRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', this.getAuthHeader())
      .withContent(JSON.stringify(
          {
              UserName : userName
          }))
      .send()
    }

  //New Password
  public newPassword(data): Promise<HttpResponseMessage> {
    return this.client
      .createRequest(RouteConfigAuth.getNewPwdRoute())
      .asPost()
      .withHeader('Content-Type', 'application/json')
      .withContent(JSON.stringify(
          {
              UserName : data.userName,
              Token: data.token,
              Password: data.password
          }))
      .send()
    }
}
