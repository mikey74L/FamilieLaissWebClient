import * as $ from 'jquery';
import {SweetAlertOptions} from 'sweetalert2';
import swal from 'sweetalert2';
import {I18N} from 'aurelia-i18n';
import {RouterConfiguration, Router, AppRouter} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MenuItemList, MenuItemModel} from './Models/MenuItemModel';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import { ShowBusyBoxEvent } from './Events/ShowBusyBoxEvent';

@inject(I18N, EventAggregator, AppRouter)
export class FamilieLaissApp {
    //Konfiguration für i18n
    loc: I18N;
    locConfig = {ns: ['Alerts', 'translation']};

    //Den Application-Router für direkte Navigation im Code
    aggregator: EventAggregator;
    appRouter: AppRouter;
    authHelper;
    messageHub;
    service;
    messageHelper;

    userInfo;
    userInfoExists;

    menuItemList: MenuItemList;

    //Public Properties 
    showNavigation;
    sidebarSwitched;
    userMenuVisible;
    dropdownSettingsVisible;
    dropdownMessagePrio1Visible;
    dropdownMessagePrio2Visible;
    dropdownMessagePrio3Visible;
    currentSkin;
    isBusy;
    countBusyIndicator;

    messagesPrio1 = [];
    countMessagesPrio1;
    messagesPrio2 = [];
    countMessagesPrio2;
    messagesPrio3 = [];
    countMessagesPrio3;

    //Constructor der Klasse "App"
    constructor(loc: I18N, aggregator: EventAggregator, router: AppRouter) {
        //Übernehmen der Parameter
        this.loc = loc;
        this.aggregator = aggregator;
        this.appRouter = router;

      	//Deklaration
        var layoutStatus;

        //Initialisieren bestimmter Properties
		    this.showNavigation = true;
		    this.dropdownSettingsVisible = false;
		    this.dropdownMessagePrio1Visible = false;
		    this.dropdownMessagePrio2Visible = false;
		    this.dropdownMessagePrio3Visible = false;
        this.isBusy = false;
        this.countBusyIndicator = 0;
        this.menuItemList = new MenuItemList(this.authHelper);
        this.userMenuVisible = false;
        // this.userInfo = new UserInfo(undefined, undefined, undefined, []);
        this.userInfoExists = false;
        this.countMessagesPrio1 = 0;
        this.countMessagesPrio2 = 0;
        this.countMessagesPrio3 = 0;

        //Laden des Skins aus dem Local-Storage
        this.currentSkin = localStorage.getItem('current-skin');
        if (this.currentSkin == null) {
            //Wenn noch kein Wert im Local-Storage vorhanden ist
            //wird der Standard-Skin gesetzt
            this.currentSkin = 'blue';
        }

		    //Ermitteln des Status des Sidebars aus dem Local-Storage des Browsers
        layoutStatus = localStorage.getItem('sidebar-status');

        //Je nach dem Status aus dem Local-Storage wird die Property gesetzt
        if (layoutStatus == 1) {
			      this.sidebarSwitched = true;

            //Setzen der CSS-Klasse so dass die Sidebar angezeigt wird
            $('body').addClass('toggled sw-toggled');
        }
        else {
			      this.sidebarSwitched = false;
        }     
        
        //Registrieren für das "ShowBusyBoxEvent"
        this.aggregator.subscribe(ShowBusyBoxEvent, message => {
            //Anzeigen oder verbergen des Indicators
            if (message.isVisible) {
                this.showBusyIndicator();
            }
            else {
                this.hideBusyIndicator();
            }
        });

        //Registrieren für das "ShowBusyBoxEvent"
        // this.aggregator.subscribe(UserInfoChangedEvent, message => {
        //     //Aktualisieren der User-Info
        //     this.userInfo.userName = message.userInfo.userName;
        //     this.userInfo.firstName = message.userInfo.firstName;
        //     this.userInfo.familyName = message.userInfo.familyName;
        //     this.userInfoExists = true;

        //     //Aktualisieren der Menüpunkte
        //     this.menuItemList.refreshMenuItems();

        //     //Ermitteln der aktuellen Nachrichten vom Server
        //     this.service.getDataPrio1()
        //         .then(result => {
        //             //Ermitteln der Anzahl
        //             this.countMessagesPrio1 = result.length;

        //             //Übernehmen der Entities
        //             this.messagesPrio1 = result;
        //         });

        //     //Ermitteln der aktuellen Nachrichten vom Server
        //     this.service.getDataPrio2()
        //         .then(result => {
        //             //Ermitteln der Anzahl
        //             this.countMessagesPrio2 = result.length;

        //             //Übernehmen der Entities
        //             this.messagesPrio2 = result;
        //         });

        //     //Ermitteln der aktuellen Nachrichten vom Server
        //     this.service.getDataPrio3()
        //         .then(result => {
        //             //Ermitteln der Anzahl
        //             this.countMessagesPrio3 = result.length;

        //             //Übernehmen der Entities
        //             this.messagesPrio3 = result;
        //         });
            
        //     //Starten des SignalR-Hubs für die Nachrichten
        //     this.startMessageHub();
        // });

        //Registrieren für das Event vom Router wenn ein Routing stattfindet
        this.aggregator.subscribe("router:navigation:processing", message => {
            //Den Busy-Indicator einblenden wenn das Routing startet
            this.showBusyIndicator();
        });

        //Registrieren für das Event vom Router wenn ein Routing beendet ist
        this.aggregator.subscribe("router:navigation:complete", message => {
            //Übernehmen ob die Navigation gerendert werden soll oder nicht anhand der aktuell ausgewählten Route
            this.showNavigation = message.instruction.config.settings.showNavigation;

            //Wenn der Auth-Zustand aktiv ist dann muss die Hintergrundfarbe wegen dem Animate angepast werden
            //dieses wird über das Hinzufügen der Klasse zum Body erreicht
            if (!this.showNavigation) {
                $('body').addClass('background-navigation');
            }
            else {
                $('body').removeClass('background-navigation');
            }

            //Den Busy-Indicator ausblenden wenn das Routing beendet ist
            this.hideBusyIndicator();
        });   
    }

    //Mit dieser Methode wird der Busy-Indicator eingeblendet
    private showBusyIndicator(): void {
        //Den Counter um eines erhöhen
        this.countBusyIndicator += 1;

        //Anzeigen der Busy-Box über setzen der Property (Binding)
        this.isBusy = true;
    }
 
    //Mit dieser Methode wird der Busy-Indicator ausgeblendet
    private hideBusyIndicator(): void {
        //Verringern des Counters um 1
        this.countBusyIndicator -= 1;

        //Wenn der Counter auf 0 ist, kann der Busy-Indicator
        //ausgeblendet werden
        if (this.countBusyIndicator == 0) {
            //Ausblenden des Busy-Indicators über zurücksetzen der Property (Binding)
            this.isBusy = false;
        }
    }

    //Wird vom Framework aufgerufen um den Main Router zu konfigurieren
    public configureRouter(config: RouterConfiguration, router: Router): void {
        //Deklaration
        var Item: MenuItemModel;

        //Zusammenstellen der Menu-Items
        this.menuItemList.addItem(undefined, ['', 'dashboard'], 'dashboard', './Dashboard', true, 
                                  this.loc.tr('Home', {ns: 'Router'}), undefined, 
                                  {showNavigation: true, needAuthentication: false}, [], true );
        Item = this.menuItemList.addItem(this.loc.tr('Stammdaten.Text', {ns: 'Router'}), '', undefined, undefined, false, 
                                         undefined, undefined, {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'category', 'category', './Views/Stammdaten/Category/category-list', true, 
                          this.loc.tr('Stammdaten.Category', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'category/:id', 'categorywithid', './stammdaten/category/category-list', true, 
                          this.loc.tr('Stammdaten.Category', {ns: 'Router'}), 'categorywithid', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'categoryedit/:operation/:id', 'categoryedit', './stammdaten/category/category-edit', true, 
                          this.loc.tr('Stammdaten.CategoryEdit', {ns: 'Router'}), 'categoryedit', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'album', 'album', './Views/Stammdaten/Album/album-list', true, 
                          this.loc.tr('Stammdaten.Album', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'album/:id', 'albumwithid', './Views/Stammdaten/Album/album-list', true, 
                          this.loc.tr('Stammdaten.Album', {ns: 'Router'}), 'albumwithid', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'albumedit/:operation/:id', 'albumedit', './Views/Stammdaten/Album/album-edit', true, 
                          this.loc.tr('Stammdaten.AlbumEdit', {ns: 'Router'}), 'albumedit', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'categoryvalue/:idFather', 'categoryvalue', './stammdaten/categoryvalue/categoryvalue-list', true, 
                          this.loc.tr('Stammdaten.CategoryValue', {ns: 'Router'}), 'categoryvalue', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'categoryvalue/:idFather/:id', 'categoryvaluewithid', './stammdaten/categoryvalue/categoryvalue-list', true, 
                          this.loc.tr('Stammdaten.CategoryValue', {ns: 'Router'}), 'categoryvaluewithid', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'categoryvalueedit/:operation/:idFather/:id', 'categoryvalueedit', './stammdaten/categoryvalue/categoryvalue-edit', true, 
                          this.loc.tr('Stammdaten.CategoryValueEdit', {ns: 'Router'}), 'categoryvalueedit', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'pictureuploadlist', 'pictureuploadlist', './stammdaten/pictureupload/picture-upload-list', true, 
                          this.loc.tr('Stammdaten.PictureUploadList', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'pictureadmin', 'pictureadmin', './stammdaten/pictureadmin/picture-admin-list', true, 
                          this.loc.tr('Stammdaten.PictureAdminList', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'pictureadmin/:idFather', 'pictureadminwithid', './stammdaten/pictureadmin/picture-admin-list', true, 
                          this.loc.tr('Stammdaten.PictureAdminList', {ns: 'Router'}), 'pictureadminwithid', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'pictureadminedit/:operation/:idFather/:id', 'pictureadminedit', './stammdaten/pictureadmin/picture-admin-edit', true, 
                          this.loc.tr('Stammdaten.PictureAdminEdit', {ns: 'Router'}), 'pictureadminedit', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'videouploadlist', 'videouploadlist', './stammdaten/videoupload/video-upload-list', true, 
                          this.loc.tr('Stammdaten.VideoUploadList', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'videoadmin', 'videoadmin', './stammdaten/videoadmin/video-admin-list', true, 
                          this.loc.tr('Stammdaten.VideoAdminList', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'videoadmin/:idFather', 'videoadminwithid', './stammdaten/videoadmin/video-admin-list', true, 
                          this.loc.tr('Stammdaten.VideoAdminList', {ns: 'Router'}), 'videoadminwithid', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'videoadminedit/:operation/:idFather/:id', 'videoadminedit', './stammdaten/videoadmin/video-admin-edit', true, 
                          this.loc.tr('Stammdaten.VideoAdminEdit', {ns: 'Router'}), 'videoadminedit', 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], false );
        Item.addChildItem(undefined, 'blog', 'blog', './stammdaten/blog/blog-list', true, 
                          this.loc.tr('Stammdaten.Blog', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item = this.menuItemList.addItem(this.loc.tr('Services.Text', {ns: 'Router'}), '', undefined, undefined, false, 
                                         undefined, undefined, {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item.addChildItem(undefined, 'videoconverter', 'videoconverter', './services/videoconverter/video-converter-list', true, 
                          this.loc.tr('Services.VideoConverter', {ns: 'Router'}), undefined, 
                          {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item = this.menuItemList.addItem(undefined, 'useradministration', 'useradministration', './auth/useradministration', true, 
                                         this.loc.tr('Authorization.UserAdministration', {ns: 'Router'}), undefined, 
                                         {showNavigation: true, needAuthentication: true}, ["Admin"], true );
        Item = this.menuItemList.addItem(undefined, 'loginuser', 'loginuser', './auth/login', true, 
                                         this.loc.tr('Authorization.Login', {ns: 'Router'}), undefined, 
                                         {showNavigation: false, needAuthentication: false}, [], false);
        Item = this.menuItemList.addItem(undefined, 'registeruser', 'registeruser', './auth/register', true, 
                                         this.loc.tr('Authorization.Register', {ns: 'Router'}), undefined, 
                                         {showNavigation: false, needAuthentication: false}, [], false);
        Item = this.menuItemList.addItem(undefined, 'forgotpassword', 'forgotpassword', './auth/forgotpassword', true, 
                                         this.loc.tr('Authorization.ForgotPassword', {ns: 'Router'}), undefined, 
                                         {showNavigation: false, needAuthentication: false}, [], false);
        Item = this.menuItemList.addItem(undefined, 'newpassword/:userName/:token', 'newpassword', './auth/newpassword', true,  
                                         this.loc.tr('Authorization.NewPassword', {ns: 'Router'}), 'newpassword', 
                                         {showNavigation: false, needAuthentication: true}, [], false);
        Item = this.menuItemList.addItem(undefined, 'confirmaccount/:userID/:code', 'confirmaccount', './auth/confirmaccount', true, 
                                         this.loc.tr('Authorization.ConfirmAccount', {ns: 'Router'}), 'confirmaccount', 
                                         {showNavigation: false, needAuthentication: false}, [], false);
        this.menuItemList.addItem(undefined, 'messages', 'messages', './messages/messagesoverview', true, 
                                  this.loc.tr('Messages.Overview', {ns: 'Router'}), undefined, 
                                  {showNavigation: true, needAuthentication: true}, [], false );

        //Konfigurieren des Routers
        config.title = this.loc.tr('Application.Title', null);
        // config.addPipelineStep('authorize', RolesAuthorizeStep);
        var routes = this.menuItemList.generateRoutes();
        config.map(routes);
    }
    
    //Wird aufgerufen wenn auf den Settings-Button in der Top-Bar
    //gedrückt wird. Hier wird die Property für die Sichtbarkeit
    //des Dropdowns gesteuert.
    public settingsDropDownClicked(eventdata): void {
        this.dropdownSettingsVisible = true;
        this.dropdownMessagePrio1Visible = false;
        this.dropdownMessagePrio2Visible = false;
        this.dropdownMessagePrio3Visible = false;
    }

    //Wird augerufen wenn auf einen der Skins im Setting
    //Dropdown geklickt wird
    public skinChangeClicked(skinName: string): void {
        //Setzen des aktuellen Skins
        this.currentSkin = skinName;

        //Speichern des Skins im Local-Storage
        localStorage.setItem('current-skin', this.currentSkin);
    }

    //Wird aufgerufen wenn auf den Fullscreen
    public fullScreenToggleClicked(): void {
        //In den Vollbildmodus wechseln
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }

        //Nach dem der Vollbildmodus gesetzt wurde wird
        //das Dropdown geschlossen
        this.dropdownSettingsVisible = false;
    }

    //Wird aufgerufen wenn auf den Menüpunkt "Local - Storage zurücksetzen"
    //geklickt wird, welcher sich in der Top-Bar befindet
    public async clearLocalStorageClicked(eventdata): Promise<any> {
        //Ausgeben einer Sicherheitsabfrage ob der Local-Storage wirklich gelöscht
        //werden soll
        var Response: Promise<any>;
        Response = await swal({
            title: this.loc.tr('Delete_Local_Storage.Question.Header', {ns: 'Alerts'}),
            text: this.loc.tr('Delete_Local_Storage.Question.Body', {ns: 'Alerts'}),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: this.loc.tr('Delete_Local_Storage.Question.Confirm_Button', {ns: 'Alerts'}),
            cancelButtonText: this.loc.tr('Delete_Local_Storage.Question.Cancel_Button', {ns: 'Alerts'}),
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        
        
        
        // (isConfirm: boolean) => {
        //     if (isConfirm) {
        //         //Löschen des Local-Storage
        //         localStorage.clear();

        //         //Bestätigungsmeldung über das Löschen des Local-Storage
        //         swal(this.loc.tr('Delete_Local_Storage.Success.Header', {ns: 'Alerts'}), 
        //              this.loc.tr('Delete_Local_Storage.Success.Body', {ns: 'Alerts'}), "success");
        //     }
        // });
 
        //Das Dropdown-Menü schließen
        this.dropdownSettingsVisible = false;
    }

    //Ein-/Ausblenden des User-Menus
    switchUserMenu() {
        this.userMenuVisible = !this.userMenuVisible;
    }

    //Aufrufen der Loginseite
    // login() {
    //     this.appRouter.navigate("loginuser");
    // }

    //Aufrufen der Registrierungsseite
    // register() {
    //     this.appRouter.navigate("registeruser");
    // }

    //Abmelden des aktuellen Benutzers
    // logout() {
    //     this.appRouter.navigate("logoutuser");
    // }

    //Zur Seite mit der Verwaltung des Benutzerprofils springen
    // showUserProfile() {

    // }

    //Startet den HUB für die Messages der Prio 1 bis 3
    // startMessageHub() {
    //     //Erstellen des Proxy für den Hub
    //     this.messageHub.createHub('MessageHub');

    //     //Erstellen der Event-Handler
    //     this.messageHub.setCallback('MessageHub', 'NewMessagesPrio1', 
    //         (data) => {
    //             if (this.userInfo.userName == data) {
    //                 //Ermitteln der aktuellen Nachrichten vom Server
    //                 this.service.getDataPrio1()
    //                     .then(result => {
    //                         //Ermitteln der Anzahl
    //                         this.countMessagesPrio1 = result.length;

    //                         //Übernehmen der Entities
    //                         this.messagesPrio1 = result;
    //                     });
    //             }
    //         });
    //     this.messageHub.setCallback('MessageHub', 'NewMessagesPrio2',             
    //         (data) => {
    //             if (this.userInfo.userName == data) {
    //                 //Ermitteln der aktuellen Nachrichten vom Server
    //                 this.service.getDataPrio2()
    //                     .then(result => {
    //                         //Ermitteln der Anzahl
    //                         this.countMessagesPrio2 = result.length;

    //                         //Übernehmen der Entities
    //                         this.messagesPrio2 = result;
    //                     });
    //             }
    //         });
    //     this.messageHub.setCallback('MessageHub', 'NewMessagesPrio3',             
    //         (data) => {
    //             if (this.userInfo.userName == data) {
    //                 //Ermitteln der aktuellen Nachrichten vom Server
    //                 this.service.getDataPrio3()
    //                     .then(result => {
    //                         //Ermitteln der Anzahl
    //                         this.countMessagesPrio3 = result.length;

    //                         //Übernehmen der Entities
    //                         this.messagesPrio3 = result;
    //                     });
    //             }
    //         });

    //     //Starten des Hubs
    //     this.messageHub.start();
    // }

    //Wird aufgerufen wenn auf den Toolbar-Button für die Nachrichten mit Prio 1 geklickt wird
    public messagePrio1Clicked(): void {
        this.dropdownSettingsVisible = false;
        this.dropdownMessagePrio1Visible = true;
        this.dropdownMessagePrio2Visible = false;
        this.dropdownMessagePrio3Visible = false;
    }

    //Wird aufgerufen wenn auf den Toolbar-Button für die Nachrichten mit Prio 2 geklickt wird
    public messagePrio2Clicked(): void {
        this.dropdownSettingsVisible = false;
        this.dropdownMessagePrio1Visible = false;
        this.dropdownMessagePrio2Visible = true;
        this.dropdownMessagePrio3Visible = false;
    }

    //Wird aufgerufen wenn auf den Toolbar-Button für die Nachrichten mit Prio 3 geklickt wird
    public messagePrio3Clicked(): void {
        this.dropdownSettingsVisible = false;
        this.dropdownMessagePrio1Visible = false;
        this.dropdownMessagePrio2Visible = false;
        this.dropdownMessagePrio3Visible = true;
    }

    //Wird aufgerufen wenn bei einem Dropdown-Menu in der Toolbar in den Hintergrund gecklickt wird 
    public toolbarBackdropClicked(): void {
        this.dropdownSettingsVisible = false;
        this.dropdownMessagePrio1Visible = false;
        this.dropdownMessagePrio2Visible = false;
        this.dropdownMessagePrio3Visible = false;
    }

    //Quittieren einer Nachricht
    // confirmMessage(messageID) {
    //     //Einblenden der Busy-Box
    //     this.showBusyIndicator();

    //     //Aufrufen der Methode auf dem Server zum quittieren der Nachricht
    //     this.messageHelper.confirmMessage(messageID)
    //     .then(message => {
    //         //Ausblenden der Busy-Box
    //         this.hideBusyIndicator();
    //     }, message => {
    //         //Ausblenden der Busy-Box
    //         this.hideBusyIndicator();

    //         //Ausgeben einer Hinweismeldung, dass die Nachricht nicht quittiert werden konnte
    //         swal({
    //             title: this.loc.tr('Message.Quit.Error.Header', {ns: 'Alerts'}),
    //             text: this.loc.tr('Message.Quit.Error.Body', {ns: 'Alerts'}),
    //             type: "error",
    //             showCancelButton: false,
    //             confirmButtonText: 'OK',
    //             closeOnConfirm: false,
    //             allowEscapeKey: true
    //         }, (isConfirm: boolean) => {
    //             if (isConfirm) {
    //                 //Es muss nichts gemacht werden
    //             }
    //         });
    //     });
    // }

    //Quittieren aller Nachrichten für eine bestimmte Prio
    // confirmAllMessages(prio) {
    //     //Einblenden der Busy-Box
    //     this.showBusyIndicator();
  
    //     //Aufrufen der Methode auf dem Server zum Quittieren der Nachrichten
    //     this.messageHelper.confirmMessagePrio(prio)
    //     .then(message => {
    //         //Ausblenden der Busy-Box
    //         this.hideBusyIndicator();
    //     }, message => {
    //         //Ausblenden der Busy-Box
    //         this.hideBusyIndicator();

    //         //Ausgeben einer Hinweismeldung, dass die Nachricht nicht quittiert werden konnte
    //         swal({
    //             title: this.loc.tr('Messages.Quit.Error.Header', {ns: 'Alerts'}),
    //             text: this.loc.tr('Messages.Quit.Error.Body', {ns: 'Alerts', 'prio': prio}),
    //             type: "error",
    //             showCancelButton: false,
    //             confirmButtonText: 'OK',
    //             closeOnConfirm: false,
    //             allowEscapeKey: true
    //         }, (isConfirm: boolean) => {
    //             if (isConfirm) {
    //                 //Es muss nichts gemacht werden
    //             }
    //         });
    //     });
    // }

    // //Anzeigen der Übersicht mit den Nachrichten
    // showMessageOverview(prio) {
    //     this.appRouter.navigate("messages");
    // }
}
