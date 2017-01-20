import * as moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/en-au';
import 'moment/locale/en-ca';
import 'moment/locale/en-gb';
import 'moment/locale/en-ie';
import 'moment/locale/en-nz';

export class DateTimeFormatValueConverter {
    toView(value: Date): string {
        //Wenn kein Datum übergeben wird, dann wird ein leerer String zurückgeliefert
        //Ansonsten wird das Datum anhand der akteullen Sprache in den entsprechenden
        //Datumsstring gewandelt
        if (value == null) {
            return "";
        }
        else {
            //Aktuelle Sprache für Moment laden
            moment.locale('de');

            //Datumsformat ausgeben
            return moment(value).format('L') + ' ' + moment(value).format('LTS');
        }
    }
}
