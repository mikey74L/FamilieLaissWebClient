//Module importieren
import {Aurelia} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import XHR from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import 'aurelia-syncfusion-bridge';

//Styles von Drittanbietern
import 'sweetalert2/dist/sweetalert2.css';
//import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'animate.css/animate.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.css';

//Styles für die Applikation
import '../styles/css/app_1.css';
import '../styles/css/app_2.css';
import '../styles/css/appstyles.css';

// comment out if you don't want a Promise polyfill (remove also from webpack.config.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .globalResources(['CustomControls/loading-indicator', 'CustomControls/input-text', 'CustomControls/input-textarea',
                      'CustomAttributes/bootstrap-tooltip', 'CustomAttributes/button-waves', 
                      'CustomAttributes/autosize-textarea'])
    .developmentLogging()
    .plugin('aurelia-syncfusion-bridge', syncfusion => {
        syncfusion.ejGrid();
    })
    .plugin('aurelia-breeze')
    .plugin('aurelia-animator-css')
    .plugin('aurelia-dialog')
    .plugin('aurelia-validation')
    .plugin('aurelia-i18n', (instance) => {
          // register i18n plugins
          instance.i18next
              .use(XHR)
              .use(LngDetector);


          // adapt options to your needs (see http://i18next.com/docs/options/)
          // make sure to return the promise of the setup method, in order to guarantee proper loading
          return instance.setup({
              backend: {                                  // <-- configure backend settings
                  loadPath: '/locale/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
              },
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
                  'Messages'],
              defaultNS: 'translation'
          });
      });
  
  //Aurelia starten
  await aurelia.start();

  //Root für Aurelia setzen
  aurelia.setRoot('FamilieLaissApp');
}
