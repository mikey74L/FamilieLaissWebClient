import { BreezeSettings } from './../Config/BreezeSettings';
import {autoinject, singleton} from 'aurelia-dependency-injection';
import {EntityManager, EntityAction, EntityType, Validator, ValidatorFunctionContext} from 'breeze-client';
import {I18N} from 'aurelia-i18n';

@singleton()
@autoinject()
export class EntityManagerFactory {
    //Members
    private loc: I18N;
    private entityManagerFamilieLaiss: EntityManager;

    //C'tor
    constructor(loc: I18N) {
        //Übernehmen der Parameter
        this.loc = loc;
    }
   
    //Dieses ist die einzige Public Methode mit der ein Entity-Manager von der Factory angefordert werden kann
    public async getEntityManager(contextManager: boolean): Promise<EntityManager> {
        //Wenn schon ein Main-Manager existiert und ein Manager zum
        //Editieren angefordert worden ist, dann wird ein neuer Manager erstellt
        if (this.entityManagerFamilieLaiss && contextManager) {
            return Promise.resolve(this.copyEntityManager());
        }
        else {
            if (contextManager) {
                await this.createMainManager();
                return Promise.resolve(this.copyEntityManager());
            }
            else {
                return this.createMainManager();
            }
        }
    }

    //Private Funktion zum Erstellen des Main-Managers für die gesamte
    //Applikation
    //Hier werden auch die Display-Names für sämtliche Entities gesetzt
    private async createMainManager(): Promise<EntityManager> {
        //Wenn noch kein Main-Manager existiert, dann wird ein
        //neuer erstellt
        if (this.entityManagerFamilieLaiss == null) {
            //Setzen der Validation Messages für Breeze
            Validator.messageTemplates.required = this.loc.tr('Validator.Required', null);
            Validator.messageTemplates.maxLength = this.loc.tr('Validator.MaxLength', null);

            //Wenn noch kein Main-Manager existiert, dann wird zuerst ein neuer
            //Manager erstellt
            this.entityManagerFamilieLaiss = new EntityManager(BreezeSettings.URLFamilieLaissBreezeAPI);
            
            //Ermitteln der Metadaten
            await this.entityManagerFamilieLaiss.fetchMetadata();

            //Setzen der Display-Names für die Facet-Groups
            var custType :any = this.entityManagerFamilieLaiss.metadataStore.getEntityType("Facet_Group");
            var dp: any = custType.getProperty("Type");
            dp.displayName = this.loc.tr('Facet_Group.Type.DisplayName', { ns: 'Metadata'});
            dp = custType.getProperty("NameGerman");
            dp.displayName = this.loc.tr('Facet_Group.Name_German.DisplayName', { ns: 'Metadata'});
            dp = custType.getProperty("NameEnglish");
            dp.displayName = this.loc.tr('Facet_Group.Name_English.DisplayName', { ns: 'Metadata'});

            //Setzen der Display-Names für die Facet-Values
            custType = this.entityManagerFamilieLaiss.metadataStore.getEntityType("Facet_Value");
            dp = custType.getProperty("NameGerman");
            dp.displayName = this.loc.tr('Facet_Value.Name_German.DisplayName', { ns: 'Metadata'});
            dp = custType.getProperty("NameEnglish");
            dp.displayName = this.loc.tr('Facet_Value.Name_English.DisplayName', { ns: 'Metadata'});

            //Setzen der Display-Names für die Media-Groups
            custType = this.entityManagerFamilieLaiss.metadataStore.getEntityType("Media_Group");
            dp = custType.getProperty("Typ");
            dp.displayName = this.loc.tr('Media_Group.Typ.DisplayName', { ns: 'Metadata'});
            dp = custType.getProperty("Name");
            dp.displayName = this.loc.tr('Media_Group.Name.DisplayName', { ns: 'Metadata'});
            dp = custType.getProperty("Description");
            dp.displayName = this.loc.tr('Media_Group.Description.DisplayName', { ns: 'Metadata'});

            //Setzen der Display-Names für die Media-Items
            custType = this.entityManagerFamilieLaiss.metadataStore.getEntityType("Media_Item");
            dp = custType.getProperty("Name");
            dp.displayName = this.loc.tr('Media_Item.Name.DisplayName', { ns: 'Metadata'});
            dp = custType.getProperty("Description");
            dp.displayName = this.loc.tr('Media_Item.Description.DisplayName', { ns: 'Metadata'});

            //Hinzufügen der Validierungsregeln für die Media-Items auf Entity-Level, da
            //diese je nach Typ unterschiedlich sind
            var PhotoItemValidator: Validator = new Validator(
                    'PhotoItemValidator', 
                    this.PhotoItemValidationFunction, 
                    { messageTemplate: this.loc.tr('Validator.Custom.MediaItem.UploadPhoto', null)}
            );
            var VideoItemValidator: Validator = new Validator(
                    'VideoItemValidator', 
                    this.VideoItemValidationFunction, 
                    { messageTemplate: this.loc.tr('Validator.Custom.MediaItem.UploadVideo', null)}
            );
            custType = this.entityManagerFamilieLaiss.metadataStore.getEntityType("Media_Item");
            custType.validators.push(PhotoItemValidator);
            custType.validators.push(VideoItemValidator);
        }

        //Funktionsergebnis
        return Promise.resolve(this.entityManagerFamilieLaiss);
    }

    //Validierungsroutine für die Media-Items bei Typ = 0
    //Es wird überprüft ob ein Photo-Upload-Item gesetzt wurde
    private PhotoItemValidationFunction(entity: any, context: ValidatorFunctionContext): boolean {
        //Wird nur zuschlagen wenn der Typ auf 0 steht
        if (entity.getProperty('Typ') === 0) {
            //Ermitteln des Wertes für die Property der ID des Upload-Photo
            var PhotoItemID: number = entity.getProperty('Upload_Picture');

            //Wenn keine ID gesetzt ist, dann ist es ein Fehler
            if (PhotoItemID == null) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };

    //Validierungsroutine für die Media-Items bei Typ = 1
    //Es wird überprüft ob ein Video-Upload-Item gesetzt wurde
    private VideoItemValidationFunction(entity: any, context: ValidatorFunctionContext): boolean {
        //Wird nur zuschlagen wenn der Typ auf 0 steht
        if (entity.getProperty('Typ') === 1) {
            //Ermitteln des Wertes für die Property der ID des Upload-Video
            var VideoItemID: number = entity.getProperty('Upload_Video');

            //Wenn keine ID gesetzt ist, dann ist es ein Fehler
            if (VideoItemID == null) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };

    //Private Funktion zum Erstellen eines Entity-Managers als Kopie
    //des Main-Managers zum Editieren
    private copyEntityManager(): EntityManager {
        //Deklaration
        var CopiedManager: EntityManager;

        //Erstellen des Managers als Kopie des Main-Managers
        CopiedManager = this.entityManagerFamilieLaiss.createEmptyCopy();

        //Funktionsergebnis
        return CopiedManager;
    }
}
