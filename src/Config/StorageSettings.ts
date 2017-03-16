export class StorageSettings {
  public static baseURL: string = 'http://localhost:51956/api/storage/';

  public static URL_GetSAS: string = 'GetSASForUploadItem';
  public static URL_GetIDForUpload: string = 'GetIDForUploadItem';
  public static URL_WriteToUploadQueue: string = 'WriteToUploadQueue';
}
