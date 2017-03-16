import { enUploadType } from '../Enum/FamilieLaissEnum';

export class NewUploadPictureModel {
  public UploadType: enUploadType;
  public ID: number;
  public BlobName: string;
  public OriginalName: string;
}
