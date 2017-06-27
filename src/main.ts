﻿//Module importieren
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import XHR from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import * as entities from './Models/Entities/Entities';
import { APISettings } from './Config/APISettings';
import { I18N } from 'aurelia-i18n';
import { ValidationMessageProvider} from 'aurelia-validation';

//Styles von Drittanbietern
import 'sweetalert2/dist/sweetalert2.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.css';

//Styles für die Applikation
import '../styles/css/app_1.css';
import '../styles/css/app_2.css';
import '../styles/css/appstyles.css';
import '../styles/css/view_animations.css';

// comment out if you don't want a Promise polyfill (remove also from webpack.config.js)
import * as Bluebird from 'bluebird';

Bluebird.config({ warnings: { wForgottenReturn: false } });

//Diese Methode wird verwendet die Localisierungs-Objekte aus dem Webpack-Bundle zu ziehen
//da dieses über die fertigen Backends nicht mit Webpack funktioniert
function loadLocales(url, options, callback, data) {
  try {
    var Locale = require('../Locale/' + url + '.json');
    callback(Locale, {status: '200'});
  } 
  catch (e) {
    callback(null, {status: '404'});
  }
}

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .globalResources([PLATFORM.moduleName('CustomControls/loading-indicator'), 
                      PLATFORM.moduleName('CustomControls/input-text-validation'),
                      PLATFORM.moduleName('CustomControls/input-textarea-validation'),
                      PLATFORM.moduleName('CustomControls/upload-control'),
                      PLATFORM.moduleName('CustomControls/picture-control'),
                      PLATFORM.moduleName('CustomControls/drop-down-control'),
                      PLATFORM.moduleName('CustomControls/validation-summary'),
                      PLATFORM.moduleName('CustomAttributes/auto-focus'),
                      PLATFORM.moduleName('CustomAttributes/bootstrap-tooltip'), 
                      PLATFORM.moduleName('CustomAttributes/button-waves'), 
                      PLATFORM.moduleName('CustomAttributes/autosize-textarea'), 
                      PLATFORM.moduleName('CustomAttributes/bootstrap-dropdown')])
    .plugin(PLATFORM.moduleName('aurelia-syncfusion-bridge'), syncfusion => {
        syncfusion.ejGrid();
        syncfusion.ejTab();
        syncfusion.ejProgressBar();
        syncfusion.ejTemplate();
        syncfusion.ejSlider();
        syncfusion.ejDropDownList();
    })
    .plugin(PLATFORM.moduleName('aurelia-api'), config => {
      config
        .registerEndpoint('api', APISettings.BaseURL)
        .setDefaultEndpoint('api');
    })
    .plugin(PLATFORM.moduleName('aurelia-orm'), builder => {
      builder.registerEntities(entities);
    })
    .plugin(PLATFORM.moduleName('aurelia-breeze'))
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'), (config) => {
        config.useDefaults();
        config.settings.lock = true;
        config.settings.centerHorizontalOnly = false;
        config.settings.keyboard = false;
        config.settings.rejectOnCancel = true;
    })
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
          // register i18n plugins
          instance.i18next
              .use(XHR)
              .use(LngDetector);

          // adapt options to your needs (see http://i18next.com/docs/options/)
          // make sure to return the promise of the setup method, in order to guarantee proper loading
          return instance.setup({
             backend: {                                  // <-- configure backend settings
                  loadPath: '{{lng}}/{{ns}}',
                  parse: (data) => data,
                  ajax: loadLocales},
             detection: {
                  order: ['localStorage', 'cookie', 'navigator'],
                  lookupCookie: 'i18next',
                  lookupLocalStorage: 'i18nextLng',
                  caches: ['localStorage', 'cookie']
              },
              attributes: ['t', 'i18n'],
              fallbackLng: 'en',
              load: 'languageOnly',
              debug: false,
              ns: ['translation', 
                  'StammAlbum', 
                  'StammCategory', 
                  'StammCategoryValue', 
                  'StammPictureAdmin',
                  'StammPictureUpload',
                  'StammVideoUpload',
                  'StammVideoAdmin',
                  'PictureShow',
                  'VideoKonverter',
                  'Router', 
                  'Datamappings', 
                  'Toasts', 
                  'Alerts', 
                  'Controls', 
                  'Metadata', 
                  'Dialogs',
                  'AuthRegister',
                  'SecurityQuestions',
                  'Countries',
                  'Validation',
                  'AuthConfirmAccount',
                  'AuthLogin',
                  'AuthForgotPassword',
                  'AuthAdminAccount',
                  'AuthNewPassword',
                  'Messages',
                  'Exif'],
              defaultNS: 'translation'
          });
      });

  //Für die Standard-Validation-Messages die Lokalisierung einbinden
  const i18n: I18N = aurelia.container.get(I18N);
  ValidationMessageProvider.prototype.getMessage = function (key) {
    const translation = i18n.tr(key, { ns: ['Validation'] });
    return this.parser.parseMessage(translation);
  }

  //Aurelia starten
  await aurelia.start();

  //Root für Aurelia setzen
  await aurelia.setRoot(PLATFORM.moduleName('FamilieLaissApp'));
}
