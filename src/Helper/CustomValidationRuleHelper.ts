import {ValidationRules} from 'aurelia-validation';
import {HttpClient} from 'aurelia-http-client';
import {singleton} from 'aurelia-dependency-injection';
import {HttpResponseMessage} from 'aurelia-http-client';

@singleton()
export class CustomValidationRuleHelper {
    constructor () {
        //Erstellen der Custom-Rule für das Vergleichen zweier Properties
        ValidationRules.customRule(
          'matchesProperty',
          (value, obj, otherPropertyName) =>
            value === null ||
            value === undefined ||
            value === '' ||
            obj[otherPropertyName] === null ||
            obj[otherPropertyName] === undefined ||
            obj[otherPropertyName] === '' ||
            value === obj[otherPropertyName],
           '${$displayName} must match $($getDisplayName($config.otherPropertyName)}',
           otherPropertyName => ({ otherPropertyName })
        );
        
        //Erstellen der Custom-Rule für das Abfragen auf dem Server ob ein Wert schon verwendet wurde
        ValidationRules.customRule(
            'valueAlreadyExists',
            (value, obj, propertyForID, propertyForAdditionalType, requestURL) => {
                if (value === null || value === undefined || value === '')
                {
                    return true;
                }
                else
                {
                    //Deklarieren des HTTP-CLient
                    let client = new HttpClient();

                    //Beim Server überprüfen ob der Wert schon existiert
                    let idForRequest: any;
                    let additionalTypeRequest : any;
                    if (obj[propertyForID] === null || obj[propertyForID] === undefined || obj[propertyForID] === '') {
                       idForRequest = -1
                    }
                    else {
                       idForRequest = obj[propertyForID];
                    }
                    if (propertyForAdditionalType === null || propertyForAdditionalType === undefined || propertyForAdditionalType === '') {
                       additionalTypeRequest = -1;
                    }
                    else {
                       if (obj[propertyForAdditionalType] === null || obj[propertyForAdditionalType] === undefined || obj[propertyForAdditionalType] === '') {
                          additionalTypeRequest = -1
                       }
                       else {
                          additionalTypeRequest = obj[propertyForAdditionalType];
                       }
                    }
                    return client.createRequest(requestURL)
                      .withHeader('Content-Type', 'application/json')
                      .asPost()
                      .withContent(JSON.stringify({ ID: idForRequest, AdditionalType: additionalTypeRequest, Value: value }))
                      .send()
                      .then((message: HttpResponseMessage) => {
                          return message.content
                      }, (message: HttpResponseMessage) => {
                          return false;
                      });
                }
            },
            '${$displayName} already exists',
            (propertyForID, propertyForAdditionalType, requestURL) => ({ propertyForID, propertyForAdditionalType, requestURL }));
    }
}
