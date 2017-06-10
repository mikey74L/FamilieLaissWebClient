import {Entity, EntityAspect, EntityType} from 'breeze-client';

export class EntityBase implements Entity {
  public entityAspect: EntityAspect;
  public entityType: EntityType;
}
