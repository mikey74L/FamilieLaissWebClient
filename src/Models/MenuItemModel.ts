import { FamilieLaissRouteConfig } from './../Helper/FamilieLaissRouteConfig';

export class MenuItemModel {
    //Members
    displayName?: string;
    link?: string;
    realRoute: boolean;
    includeInMenu: boolean;

    iconCssClass: string;

    route: string | Array<string>;
    name?: string;
    moduleId?: string;
    nav?: boolean;
    title?: string;
    href?: string;
    userGroups?: Array<string>;
    settings?: Object;

    hasChildItems: boolean;
    childItems: Array<MenuItemModel>;

    //C'tor
    constructor(displayName: string | undefined, iconCssClass: string, route: string | Array<string>, name: string | undefined, 
                moduleId: string | undefined, nav: boolean, title: string | undefined, 
                href: string | undefined, settings: Object, userGroups: Array<string>, includeInMenu: boolean) {
        //Initialisieren
        this.hasChildItems = false;
        this.childItems = [];

        //Übernehmen der Parameter
        this.iconCssClass = iconCssClass;
        this.displayName = displayName;
        this.route = route;
        this.name = name;
        this.moduleId = moduleId;
        this.nav = nav;
        this.title = title;
        this.href = href;
        this.userGroups = userGroups;
        this.includeInMenu = includeInMenu;
        this.settings = settings;

        //Ermitteln ob es sich um eine echte Route handelt
        if (this.route == undefined || this.route == '') {
            this.realRoute = false;
        }
        else {
            this.realRoute = true;
        }

        //Wenn es sich um eine echte Route handelt dann wird der
        //Display-Name gesetzt
        if (this.realRoute) {
            this.displayName = this.title;
        }

        //Setzen des Links
        if (this.realRoute) {
            if (this.href == undefined) {
                this.link = "#/" + this.route;
            }
            else {
                this.link = "#/" + this.href;
            }
        }
        else {
            this.link = "";
        }
    }

    //Fügt ein Child-Menu-Item hinzu
    public addChildItem(displayName: string | undefined, iconCssClass: string, route: string | Array<string>, name: string | undefined, 
                        moduleId: string | undefined, nav: boolean, title: string | undefined, 
                        href: string | undefined, settings: Object, userGroups: Array<string>, includeInMenu: boolean): void {
        //Hinzufügen eines neuen Child-Items
        this.childItems.push(new MenuItemModel(displayName, iconCssClass, route, name, moduleId, nav, title, href, settings, userGroups, includeInMenu));

        //Setzen der benötigten Properties
        this.hasChildItems = true;
    }
}

export class MenuItemList {
    //Deklaration
    menuItems: Array<MenuItemModel>;
    menuItemsMenu: Array<MenuItemModel>;

    authHelper;

    //C'tor
    constructor(authorization) {
        //Initialisieren
        this.menuItems = [];
        this.menuItemsMenu = [];
        this.authHelper = authorization;
    }

    //Wird von GenerateRoutes aufgerufen um die Sub-Menüpunkte der unteren Ebene für den
    //Router zu erzeugen
    private generateChildRoutes(routes: Array<FamilieLaissRouteConfig>, item: MenuItemModel): void {
        //Deklaration
        var newItem: FamilieLaissRouteConfig;

        //Hinzufügen der Routes
        for (var menuItem of item.childItems)
        {
            if (menuItem.realRoute) {
                if (menuItem.href == undefined)
                {
                    newItem = new FamilieLaissRouteConfig();
                    newItem.route = menuItem.route;
                    newItem.name = menuItem.name;
                    newItem.moduleId = menuItem.moduleId;
                    newItem.nav = menuItem.nav;
                    newItem.title = menuItem.title;
                    newItem.userGroups = menuItem.userGroups;
                    newItem.settings = menuItem.settings;
                }
                else {
                    newItem = new FamilieLaissRouteConfig();
                    newItem.route = menuItem.route;
                    newItem.name = menuItem.name;
                    newItem.moduleId = menuItem.moduleId;
                    newItem.href = menuItem.href;
                    newItem.nav = menuItem.nav;
                    newItem.title = menuItem.title;
                    newItem.userGroups = menuItem.userGroups;
                    newItem.settings = menuItem.settings;
                }
                routes.push(newItem);
            }
        }
    }

    //Hiermit kann ein Menüpunkt auf oberster Ebene hinzugefügt werden
    public addItem(displayName: string | undefined, iconCssClass: string, route: string | Array<string>, name: string | undefined, 
                   moduleId: string | undefined, nav: boolean, title: string | undefined, 
                   href: string | undefined, settings: Object, userGroups: Array<string>, includeInMenu: boolean): MenuItemModel {
        //Deklaration
        var Item: MenuItemModel;

        //Erzeugen des Menu-Items
        Item = new MenuItemModel(displayName, iconCssClass, route, name, moduleId, nav, title, href, settings, userGroups, includeInMenu);

        //Hinzufügen des Items zur Liste
        this.menuItems.push(Item);
        // if (this.authHelper.isUserInRole(userGroups)) {
            this.menuItemsMenu.push(Item);
        // }

        //Das neue Menu-Item zurückgeben
        return Item;
    }

    //Wird aufgerufen um die Routes für den Router anhand der Menüpunkte zu generieren
    public generateRoutes(): Array<FamilieLaissRouteConfig> {
        //Deklaration
        var routes: Array<FamilieLaissRouteConfig> = [];
        var newRouteItem: FamilieLaissRouteConfig;

        //Hinzufügen der Routes
        for (var menuItem of this.menuItems)
        {
            if (menuItem.realRoute) {
                if (menuItem.href == undefined)
                {
                    newRouteItem = new FamilieLaissRouteConfig();
                    newRouteItem.route= menuItem.route;
                    newRouteItem.name = menuItem.name; 
                    newRouteItem.moduleId = menuItem.moduleId; 
                    newRouteItem.nav = menuItem.nav;
                    newRouteItem.title = menuItem.title;
                    newRouteItem.userGroups = menuItem.userGroups;
                    newRouteItem.settings = menuItem.settings;
                }
                else {
                    newRouteItem = new FamilieLaissRouteConfig();
                    newRouteItem.route = menuItem.route;
                    newRouteItem.name = menuItem.name;
                    newRouteItem.moduleId = menuItem.moduleId;
                    newRouteItem.href = menuItem.href;
                    newRouteItem.nav = menuItem.nav;
                    newRouteItem.title = menuItem.title;
                    newRouteItem.userGroups = menuItem.userGroups;
                    newRouteItem.settings = menuItem.settings;
                }
                routes.push(newRouteItem);
            }

            if (menuItem.hasChildItems) this.generateChildRoutes(routes, menuItem);
        }

        //Return-Value
        return routes;
    }

    //Aktualisieren der Menüpunkte zur Anzeige der Navigation.
    //Wird aufgerufen wenn sich der aktuell angemeldete Benutzer geändert hat,
    //da dieser anderen Rollen angehören kann.
    public refreshMenuItems():void {
        //Zurücksetzen der bisherigen Menüpunkte
        this.menuItemsMenu.length = 0;

        //Neu befüllen der anzuzeigenden Menüpunkte
        for (var Item of this.menuItems)
        {
        //     if (this.authHelper.isUserInRole(Item.userGroups)) {
                this.menuItemsMenu.push(Item);
        //     }
        }
    }
}
