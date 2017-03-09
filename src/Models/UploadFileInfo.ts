import {SizeToString} from '../Helper/HelperFunctions';
import {I18N} from 'aurelia-i18n';

export class UploadFileInfo {
  fileName: string;
  fileSize: number;
  fileSizeText: string;
  isUploaded: boolean;
  withError: boolean;
  percentageDone: number;
  statusText: string;
  file: File;
  loc: I18N;

  //C'tor
  constructor (loc: I18N, file: File) {
    //Übernehmen des Files
    this.file = file;

    //Übernehmen des Lokalisierungsobjektes
    this.loc = loc;
    
    //Übernehmen der Properties aus dem File 
    this.fileName = this.file.name;
    this.fileSize = this.file.size;
    this.isUploaded = false;
    this.percentageDone = 0;
    this.withError = false;
 
    //Zusammenstellen der File-Size als Text 
    this.fileSizeText = SizeToString(this.fileSize);

    //Setzen des Statustexts
    this.statusText = this.loc.tr('Uploadcontrol.Status.Added', { ns: 'Controls' });
  }
}
