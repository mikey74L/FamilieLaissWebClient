import {SizeToString} from '../Helper/HelperFunctions';

export class UploadFileInfo {
  fileName: string;
  fileSize: number;
  fileSizeText: string;
  file: File;

  //C'tor
  constructor (file: File) {
    //Übernehmen des Files
    this.file = file;

    //Übernehmen der Properties aus dem File 
    this.fileName = this.file.name;
    this.fileSize = this.file.size;

    //Zusammenstellen der File-Size als Text 
    this.fileSizeText = SizeToString(this.fileSize);
  }
}
