export class DeletePictureEvent {
  item: any;

  constructor (deleteItem: any) {
    this.item = deleteItem;
  }
}

export class ChoosePictureEvent {
  item: any;

  constructor (chooseItem: any) {
    this.item = chooseItem;
  }
}

export class EditPictureEvent {
  item: any;

  constructor (editItem: any) {
    this.item = editItem;
  }
}
