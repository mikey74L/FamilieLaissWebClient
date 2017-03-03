export class ForeignKeyData {
  ID: number;
  DisplayName: string;
  
  constructor(identifier: number, text: string)
  {
    this.ID = identifier;
    this.DisplayName = text;
  }
}
