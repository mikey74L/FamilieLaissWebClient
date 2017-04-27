import {ViewModelAssignEdit} from '../../../Helper/ViewModelHelper';
import {AppRouter} from 'aurelia-router';
import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService, DialogResult} from 'aurelia-dialog';
import {PictureURLHelper} from '../../../Helper/PictureURLHelper';
import {SelectPickerListMultiple, SelectPickerGroupItem} from '../../../Helper/SelectPickerHelper';
import {PictureAdminServiceEdit} from './picture-admin-service';
import {enViewModelEditMode} from '../../../Enum/FamilieLaissEnum';
import {ShowPictureBigArgs} from '../../../Models/ShowPictureBigArgs';
import swal from 'sweetalert2';

@autoinject()
export class PictureAdminEdit extends ViewModelAssignEdit {
    //Konfiguration für i18N
    locConfig: any = { ns: ['StammPictureAdmin', 'translation']};

    //Members
    uploadItem: any;
    photoChoosed: boolean;

    categoryList: SelectPickerListMultiple;
    titleSelectPickerCategoryList;

    currentPhotoURL: string;
    isChoosePictureEnabled: boolean;
    isChangeImageParameterEnabled: boolean;

    URLHelper: PictureURLHelper;

    //C'tor
    constructor(loc:I18N, eventAggregator: EventAggregator, dialogService: DialogService, router: AppRouter, 
                service: PictureAdminServiceEdit, urlHelper: PictureURLHelper) {
        //Aufrufen der Vater-Klasse
        super(loc, eventAggregator, dialogService, "pictureadmin", router, service);

        //Übernehmen der Parameter
        this.URLHelper = urlHelper;

        //Initialisierung
        this.photoChoosed = false;

        //Zusammenstellen der URL für das Placeholder-Photo
        this.currentPhotoURL = this.URLHelper.getImageURLPlaceholderPicture(300, 230); 

        //Ermitteln des lokalisierten Textes für den Titel des Select-Pickers
        this.titleSelectPickerCategoryList = this.loc.tr('Edit.Card.Body.Form.Selects.Category.Placeholder', { ns: 'StammPictureAdmin'});

        //Initialisieren der Liste
        this.categoryList = new SelectPickerListMultiple();
    }

    //Anzeigen des Dialoges zur Auswahl eines Upload-Photos
    public async choosePicture(): Promise<void> {
      //Deklaration
      var Result: DialogResult;

      //Aurelia-Dialog instanziieren
      Result = await this.dialogService.open({ viewModel: 'CustomDialogs/ChooseUploadPictureDialog', model: this.service});
 
      //Auswerten des Results
      if (Result.wasCancelled) {
        //Ausgeben von Logging-Informationen
        console.log('Photo not choosed - Dialog cancelled');
      } 
      else {
        //Ausgeben von Logging-Informationen
        console.log('Photo choosed');

        //Übernehmen des ausgewählten Bildes
        this.uploadItem = Result.output;
        this.photoChoosed = true;

        //Setzen der ID für das Bild im Media-Item
        (<any>this.itemToEdit).ID_UploadPicture = this.uploadItem.ID;

        //Setzen der URL
        this.setCurrentPhotoURL();

        //Validierung erneut starten wenn ein Bild ausgewählt wurde
        this.itemToEdit.entityAspect.validateEntity();
      }
    }

    //Wird von Aurelia aufgerufen wenn die View
    //aufgerufen wird
    protected async activateChild(info: any): Promise<void> {
      //Deklarationen
      var CategoryResult: Array<any>;
      var NewCategoryGroup: SelectPickerGroupItem;
      var Assigned: boolean;
      var itemToEditTypeless: any = this.itemToEdit;

      //Laden der Kategorien über ein Promise
      CategoryResult = await this.service.getCategories();

      //In einer Schleife durch alle Kategorien durchgehen
      for (var Item of CategoryResult) {
        //Kategorie hinzufügen
        NewCategoryGroup = this.categoryList.addGroup(Item.ID, Item.NameGerman);

        //In einer Schleife durch alle Kategorie-Werte durchgehen
        for (var Item2 of Item.Values) {
          //Wenn im Edit-Modus dann muss überprüft werden ob der Facet-Value dem
          //Photo schon zugeordnet ist
          Assigned = false;
          if (this.editMode == enViewModelEditMode.Edit) {
            for (var FacetValue of itemToEditTypeless.MediaItemFacets) {
              if (FacetValue.ID_FacetValue == Item2.ID) {
                Assigned = true;
                break;
              }
            }
          }

          //Hinzufügen des Facet-Values
          NewCategoryGroup.addValue(Item2.ID, Item2.NameGerman, Assigned, Item2);
        }
      }
      
      // //Im Editiermodus müssen die Properties für das Photo noch richtig gesetzt werden
      //       if (this.editMode == "edit") {
      //           //Auswählen des Photos
      //           this.uploadItem = this.itemToEdit.UploadPicture;
      //           this.photoChoosed = true;

      //           //Setzen der URL für das Photo
      //           this.setCurrentPhotoURL();
      //       }

            //Überprüfen der Buttons
            this.checkEnabledState();
    }

    //Setzen der aktuellen URL für das Bild
    private setCurrentPhotoURL(): void {
        //Setzen der aktuellen URL
        this.currentPhotoURL = this.URLHelper.getImageURLUpload(this.uploadItem);
    }

    //Aufrufen des Dialoges zur Anzeige des Photos in Großansicht
    public async showPicture(): Promise<void> {
        //Deklaration
        var Result: DialogResult;

        //Wenn ein Photo ausgewählt wurde, dann wird dieses in Großansicht angezeigt
        if (this.photoChoosed) {
            //Aufrufen des Aurelia-Dialoges zur Anzeige des Bildes
            //im Großformat
            Result = await this.dialogService.open({ viewModel: 'CustomDialogs/ShowPictureBigDialog', model: new ShowPictureBigArgs(1, this.uploadItem)});
        }
    }
   
    //Hiermit wird der Dialog zur Bildbearbeitung aufgerufen
    public changeImageParameter(): void {
        // //Erstellen der Start-Args
        // var StartArgs = new ChangeImagePropertyStartArgs(this.uploadItem);

        // //Anzeigen des Aurelia-Dialoges zur Bildbearbeitung
        // this.dialog.open({ viewModel: ChangeImagePropertiesDialog, model: StartArgs}).then(response => {
        //     if (response.wasCancelled) {
        //         //Ausgeben von Logging-Informationen
        //         console.log('Dialog cancelled - Image properties not changed');
        //     } 
        //     else {
        //         //Ausgeben von Logging
        //         console.log('Image properties changed');

        //         //Ermitteln ob es schon eine Image-Property gibt
        //         if (this.uploadItem.ImageProperty != null) {
        //             //Setzen der Rotation
        //             this.uploadItem.ImageProperty.Rotate = response.output;

        //             //Aktualisieren der URL des Photos
        //             this.setCurrentPhotoURL();
        //         }
        //         else {
        //             //Eine neue Image-Property-Erstellen
        //             this.service.createImageProperty(this.uploadItem, response.output)
        //             .then( result => {
        //                 //Aktualisieren der URL des Photos
        //                 this.setCurrentPhotoURL();
        //             });
        //         }
        //     }
        // });
    }

    //Wird aufgerufen wenn auf den Cancel-Button geklickt wird
    public async cancelChanges(): Promise<void> {
        //Nur wenn sich auch etwas geändert hat oder es sich um einen neuen Eintrag handelt, dann wird auch eine
        //Sicherheitsabfrage ausgegeben
        if (this.editMode == enViewModelEditMode.New || (this.editMode == enViewModelEditMode.Edit && this.service.hasChanges())) {
            //Anzeigen einer Sicherheitsabfrage ob wirklich abgebrochen werden soll
            try {
              await swal(
                {
                    titleText: this.loc.tr('Cancel_Edit.Question.Header', { ns: 'Alerts' }),
                    text: this.loc.tr('Cancel_Edit.Question.Body', { ns: 'Alerts' }),
                    type: 'warning',
                    width: 600,
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: this.loc.tr('Cancel_Edit.Question.Confirm_Button', { ns: 'Alerts' }),
                    cancelButtonText: this.loc.tr('Cancel_Edit.Question.Cancel_Button', { ns: 'Alerts' }),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }
              );

              //Ausführen der eigentlichen Cancel-Prozedur
              this.cancelChangesExecute();
            }
            catch (ex) {
            }
        }
        else {
            //Ausführen der eigentlichen Cancel-Prozedur
            this.cancelChangesExecute();
        }
    }
 
    //Führt den tatsächlichen Cancel aus
    private cancelChangesExecute(): void {
        //Verwerfen der Änderungen
        this.service.rejectChanges();
                
        //Benachrichtigung ausgeben
        this.showNotifyInfo(this.loc.tr('PictureAdmin.Cancel.Success', { ns: 'Toasts', context: this.editMode }));

        //Die Event-Handler deregistrieren
        this.unsubscribeEvents();

        //Zurückkehren zur Liste der Kategorien
        this.router.navigate(this.routeForList + "/" + this.fatherItem.ID);
    }

    //Überprüft den Status der Buttons
    protected checkEnabledState(): void {
        //Überprüfen des Status für den Save-Button
        if (this.isBusy) {
            this.isSavingEnabled = false;
            this.isChoosePictureEnabled = false;
            this.isChangeImageParameterEnabled = false;
        }
        else {
            //Bei einem neuen Photo ist der Button zur Auswahl eines
            //Upload-Photos freigeschalten. Beim Editieren ist er gesperrt.
            if (this.editMode == enViewModelEditMode.New) {
                this.isChoosePictureEnabled = true;
            }
            else {
                this.isChoosePictureEnabled = false;
            }

            //Überprüfen des Status für den Button der Bildbearbeitung
            if (this.photoChoosed) {
                this.isChangeImageParameterEnabled = true;
            }
            else {
                this.isChangeImageParameterEnabled = false;
            }
            
            //Überprüfen des Status des Save-Buttons
            if (this.itemToEdit.entityAspect.hasValidationErrors) {
                this.isSavingEnabled = false;
            }
            else {
                this.isSavingEnabled = true;
            }
        }
    }

    //Wird aufgerufen wenn auf den Save-Button geklickt wird
    public async saveChanges(): Promise<void> {
        // //Deklaration
        // var PromiseArray = [];
        // var CurrentPromise;

        // //Einblenden der Busy-Box
        // this.setBusyState(true);

        // //Auswerten der Kategorie-Werte die sich geändert haben
        // var ChangedCategories = this.categoryList.getChangedValues();

        // //Für alle hinzugefügten Kategoriewerte ein Promise erstellen
        // for (var CategoryValue of ChangedCategories) {
        //     if (CategoryValue.assigned) {
        //         CurrentPromise = this.service.createNewAssignedCategory(this.itemToEdit, CategoryValue.id);
        //         PromiseArray.push(CurrentPromise);
        //     }
        // }

        // //Für alle entfernten Kategoriewerte ein Promise erstellen
        // for (var CategoryValue of ChangedCategories) {
        //     if (!CategoryValue.assigned) {
        //         CurrentPromise = this.service.removeAssignedCategory(CategoryValue.originalItem);
        //         PromiseArray.push(CurrentPromise);
        //     }
        // }

        // //Speichervorgang in einem Promise ausführen
        // Promise.all(PromiseArray).then((results) => {
        //     //Aufrufen der Speicherroutine
        //     return this.service.saveChanges();
        // })
        // .then(() => {
        //     //Ausblenden der Busy-Box
        //     this.setBusyState(false);

        //     //Ausgeben einer Erfolgsmeldung
        //     this.showNotifySuccess(this.loc.tr('PictureAdmin.Save.Success', { ns: 'Toasts' }));

        //     //Die Event-Handler deregistrieren
        //     this.unsubscribeEvents();

        //     //Zurück zur Administrations-Liste der Bilder springen
        //     this.router.navigate(this.route + "/" + this.fatherItem.ID);
        // })
        // .catch((reason) => {
        //     //Ausblenden der Busy-Box
        //     this.setBusyState(false);

        //     //Überprüfen ob Validierungsfehler anstehen. Wenn ja liegt das
        //     //fehlerhafte Speichern an den Validierungsfehlern und es muss nichts
        //     //weiter gemacht werden.
        //     //Wenn nicht muss eine entsprechende Fehlermeldung angezeigt werden,
        //     //dass das Speichern nicht funktioniert hat
        //     if (!this.itemToEdit.entityAspect.hasValidationErrors) {
        //         this.showNotifyError(this.loc.tr('PictureAdmin.Save.Error', { ns: 'Toasts' }));
        //     }
        // })
    }

    //Wird hier nicht benötigt
    protected attachedChild(): void {
      
    }
    
    //Wird hier nicht benötigt
    protected attachedChildTimeOut() : void 
    {
    }

    //Wird hier nicht benötigt
    protected busyStateChanged(): void {

    }
}
