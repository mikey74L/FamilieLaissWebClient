import { EntityBase } from './Entities/EntityBase';

export class LoadDataWithFatherModel {
  public fatherItem: EntityBase;
  public entities: Array<EntityBase>
}

export class EditDataWithFatherModel {
  public fatherItem: EntityBase;
  public editItem: EntityBase;
}
