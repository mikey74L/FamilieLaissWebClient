export enum enUploadType {
  Picture = 1,
  Video = 2
}

export enum enMediaType {
  Picture = 1,
  Video = 2
}

export enum enFacetType {
  Both = 0,
  Picture = 1,
  Video = 2,
}

export enum enSortDirection {
  Ascending = <any>"ascending",
  Descending = <any>'descending'
}

export enum enViewModelEditMode {
  New = <any>"new",
  Edit = <any>"edit"
}

export enum enEntityType {
  FacetGroup = <any>"FacetGroup",
  FacetValue = <any>"FacetValue",
  MediaGroup = <any>"MediaGroup",
  UploadPictureItem = <any>"UploadPictureItem"
}

export enum enUploadPictureStatus {
  Uploaded = 0,
  Assigned = 1
}
