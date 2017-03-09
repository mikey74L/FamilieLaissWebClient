import {HttpClient, json} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-dependency-injection';
import {StorageSettings} from '../Config/StorageSettings';
import {Exception404, Exception500} from '../Exception/UserException';

@autoinject()
export class StorageService {
  //Members
  private client: HttpClient;
  private sasURLUploadPicture: string;

  //C'tor
  constructor(client: HttpClient) {
     //Übernehmen der Parameter
     this.client = client;

     //Initialisieren der Parameter
     this.sasURLUploadPicture = '';
  }

  //Mit dieser Methode wird vom Server die SAS-URL für die Upload-Picture ermittelt
  private async getSASForUploadPicture(): Promise<void> {
    //Die asynchrone Abfrage zum Server durchführen
    var Result: Response = await this.client
      .configure(config => {
        config
        .withBaseUrl(StorageSettings.baseURL)
        .withDefaults( { mode: 'cors', cache: 'no-cache'})
      })
      .fetch(StorageSettings.URL_GetSAS, {
      method: 'GET'});

    //Auswerten des Results
    if (Result.ok) {
       this.sasURLUploadPicture = await Result.text();
       this.sasURLUploadPicture = this.sasURLUploadPicture.replace('"', '');
       this.sasURLUploadPicture = this.sasURLUploadPicture.replace('"', '');
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
  
  //Zurücksetzen der SAS für den Picture-Upload 
  public resetSASForPictureUpload() : void {
    this.sasURLUploadPicture = '';
  }

  //Mit dieser Methode wird ein Block-Blob in Azure-Storage geschrieben
  public async submitBlock(uploadType: enUploadType, fileName: string, blockIDs: Array<string>, data: any): Promise<number> {
    //Ermitteln ob schon eine SAS-URI existiert
    if (uploadType == enUploadType.Picture) {
      if (this.sasURLUploadPicture.length == 0) {
        await this.getSASForUploadPicture();
      }
    }
    
    //Zusammensetzen der richtigen URI
    var BaseURI: string = '';
    var BlockURI: string = '';
    var indexOfQueryStart: number;
    if (uploadType == enUploadType.Picture) {
      indexOfQueryStart = this.sasURLUploadPicture.indexOf("?");
      BaseURI = this.sasURLUploadPicture.substr(0, indexOfQueryStart);
      BlockURI = '/' + fileName + this.sasURLUploadPicture.substr(indexOfQueryStart) + '&comp=block&blockid=' + blockIDs[blockIDs.length - 1];
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
    if (uploadType == enUploadType.Picture) {
      if (this.sasURLUploadPicture.length == 0) {
        await this.getSASForUploadPicture();
      }
    }

    //Zusammensetzen der richtigen URI
    var BaseURI: string = '';
    var CommitURI: string = '';
    var indexOfQueryStart: number;
    if (uploadType == enUploadType.Picture) {
      indexOfQueryStart = this.sasURLUploadPicture.indexOf("?");
      BaseURI = this.sasURLUploadPicture.substr(0, indexOfQueryStart);
      CommitURI = '/' + fileName + this.sasURLUploadPicture.substr(indexOfQueryStart) + '&comp=blocklist';
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

export enum enUploadType {
  Picture = 1,
  Video = 2
}
