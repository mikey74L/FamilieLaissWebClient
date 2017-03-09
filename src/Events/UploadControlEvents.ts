export class UploadInProgressEvent {
    //Members
    public isInProgress: boolean;
    
    //C'tor
    constructor(inProgress: boolean) {
        this.isInProgress = inProgress;
    }
}
