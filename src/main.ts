﻿//Module importieren
import {Aurelia} from 'aurelia-framework';

//Styles von Drittanbietern
import 'sweetalert2/dist/sweetalert2.css';
import 'toastr/build/toastr.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
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
    .developmentLogging();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');

  // if you would like your website to work offline (Service Worker), 
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
