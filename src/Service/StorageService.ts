import { NewUploadPictureModel } from './../Models/NewUploadPictureModel';
import {HttpClient, json} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-dependency-injection';
import {StorageSettings} from '../Config/StorageSettings';
import {Exception404, Exception500} from '../Exception/UserException';
import {enUploadType} from '../Enum/FamilieLaissEnum';
import * as $ from 'jquery';

@autoinject()
export class StorageService {
  //Members
  private client: HttpClient;
  private sasURLUploadItem: string;

  //C'tor
  constructor(client: HttpClient) {
     //Übernehmen der Parameter
     this.client = client;

     //Initialisieren der Parameter
     this.sasURLUploadItem = '';
  }

  //Mit dieser Methode wird vom Server die SAS-URL für das Upload-Item ermittelt
  private async getSASForUploadItem(uploadType: enUploadType): Promise<void> {
    //Die asynchrone Abfrage zum Server durchführen
    var Result: Response = await this.client
      .configure(config => {
        config
        .withBaseUrl(StorageSettings.baseURL)
        .withDefaults( { mode: 'cors', cache: 'no-cache'})
      })
      .fetch(StorageSettings.URL_GetSAS + '?uploadType=' + uploadType, {
      method: 'GET'});

    //Auswerten des Results
    if (Result.ok) {
       this.sasURLUploadItem = await Result.text();
       this.sasURLUploadItem = this.sasURLUploadItem.replace('"', '');
       this.sasURLUploadItem = this.sasURLUploadItem.replace('"', '');
    }
    else {
      switch (Result.status)
      {
        case 404:
          return Promise.reject(new Exception404());
        case 500:
          return Promise.reject(new Exception500());
        default:
          return Promise.reject(new Exception500());
      }
    }

    //Funktionsergebnis
    return Promise.resolve();
  }
  
  //Ermittelt eine neue ID für ein Upload-Item vom Server unter der das
  //Item im Azure Storage gespeichert wird
  public async getIDForUploadFromServer(uploadType: enUploadType): Promise<number> {
    //Die asynchrone Abfrage zum Server durchführen
    var Result: Response = await this.client
      .configure(config => {
        config
        .withBaseUrl(StorageSettings.baseURL)
        .withDefaults( { mode: 'cors', cache: 'no-cache'})
      })
      .fetch(StorageSettings.URL_GetIDForUpload + '?uploadType=' + uploadType, {
      method: 'GET'})
    
    //Auswerten des Results
    if (!Result.ok) {
      switch (Result.status)
      {
        case 404:
          return Promise.reject(new Exception404());
        case 500:
          return Promise.reject(new Exception500());
        default:
          return Promise.reject(new Exception500());
      }
    }

    //Funktionsergebnis
    var IDText: string = await Result.text();
    return Promise.resolve(parseInt(IDText));
  }

  //Erstellt einen Eintrag in der Azure-Queue so dass der Web-Job
  //die hochgeladene Datei weiter verarbeiten kann
  public async writeToUploadQueue(uploadType: enUploadType, id: number, nameBlob: string, originalName: string): Promise<void> {
    //Zusammenstellen des Objektes
    var RequestBody: NewUploadPictureModel = new NewUploadPictureModel();
    RequestBody.ID = id;
    RequestBody.UploadType = uploadType;
    RequestBody.BlobName = nameBlob;
    RequestBody.OriginalName = originalName;

    //Die asynchrone Abfrage zum Server durchführen
    var Result: Response = await this.client
      .configure(config => {
        config
        .withBaseUrl(StorageSettings.baseURL)
        .withDefaults( {  
          mode: 'cors', 
          cache: 'no-cache',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
      })
      .fetch(StorageSettings.URL_WriteToUploadQueue, {
      method: 'POST', body: $.param(RequestBody)})
    
    //Auswerten des Results
    if (!Result.ok) {
      switch (Result.status)
      {
        case 404:
          return Promise.reject(new Exception404());
        case 500:
          return Promise.reject(new Exception500());
        default:
          return Promise.reject(new Exception500());
      }
    }

    //Funktionsergebnis
    return Promise.resolve();
  }

  //Zurücksetzen der SAS für das Upload-Item 
  public resetSASForUploadItem() : void {
    this.sasURLUploadItem = '';
  }

  //Mit dieser Methode wird ein Block-Blob in Azure-Storage geschrieben
  public async submitBlock(uploadType: enUploadType, fileName: string, blockIDs: Array<string>, data: any): Promise<number> {
    //Ermitteln ob schon eine SAS-URI existiert
    if (this.sasURLUploadItem.length == 0) {
      await this.getSASForUploadItem(uploadType);
    }
    
    //Zusammensetzen der richtigen URI
    var BaseURI: string = '';
    var BlockURI: string = '';
    var indexOfQueryStart: number;
    if (uploadType == enUploadType.Picture) {
      indexOfQueryStart = this.sasURLUploadItem.indexOf("?");
      BaseURI = this.sasURLUploadItem.substr(0, indexOfQueryStart);
      BlockURI = '/' + fileName + this.sasURLUploadItem.substr(indexOfQueryStart) + '&comp=block&blockid=' + blockIDs[blockIDs.length - 1];
    }

    //Zusammensetzen des Body
    var BodyForBlock: any = new Uint8Array(data);
     
    //Absetzen des Commits gegen den Azure-Storage
    var Result: Response = await this.client
      .configure(config => {
        config.withBaseUrl(BaseURI)
              .withDefaults({
                mode: 'cors', 
                cache: 'no-cache', 
                headers: {'x-ms-blob-type': 'BlockBlob', 
                          'Content-Length': BodyForBlock.length.toString()
                }
              })
      })
      .fetch(BlockURI, {method: 'PUT', 
                        body: BodyForBlock}
      );
    
    //Auswerten des Results
    if (Result.ok) {
      return Promise.resolve(BodyForBlock.length);
    }
    else {
      switch (Result.status)
      {
        case 404:
          return Promise.reject(new Exception404());
        case 500:
          return Promise.reject(new Exception500());
        default:
          return Promise.reject(new Exception500());
      }
    }
  }

  //Mit dieser Methode wird die Block-Liste im Azure-Storage Commited
  public async commitBlockList(uploadType: enUploadType, fileName: string, blockIDs: Array<string>, fileType: string): Promise<void> {
    //Ermitteln ob schon eine SAS-URI existiert
    if (this.sasURLUploadItem.length == 0) {
      await this.getSASForUploadItem(uploadType);
    }

    //Zusammensetzen der richtigen URI
    var BaseURI: string = '';
    var CommitURI: string = '';
    var indexOfQueryStart: number;
    if (uploadType == enUploadType.Picture) {
      indexOfQueryStart = this.sasURLUploadItem.indexOf("?");
      BaseURI = this.sasURLUploadItem.substr(0, indexOfQueryStart);
      CommitURI = '/' + fileName + this.sasURLUploadItem.substr(indexOfQueryStart) + '&comp=blocklist';
    }

    //Zusammensetzen des Body
    var BodyForCommit: string = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
    for (var BlockID of blockIDs) {
      BodyForCommit += '<Latest>' + BlockID + '</Latest>';
    }
    BodyForCommit += '</BlockList>';

    //Absetzen des Commits gegen den Azure-Storage
    var Result: Response = await this.client
      .configure(config => {
        config.withBaseUrl(BaseURI)
              .withDefaults({
                mode: 'cors', 
                cache: 'no-cache', 
                headers: {'x-ms-blob-content-type': fileType, 
                          'Content-Length': BodyForCommit.length.toString()
                }
              })
      })
      .fetch(CommitURI, {method: 'PUT', 
                         body: BodyForCommit}
      );

    //Auswerten des Results
    if (Result.ok) {
      return Promise.resolve();
    }
    else {
      switch (Result.status)
      {
        case 404:
          return Promise.reject(new Exception404());
        case 500:
          return Promise.reject(new Exception500());
        default:
          return Promise.reject(new Exception500());
      }
    }
  }
}

