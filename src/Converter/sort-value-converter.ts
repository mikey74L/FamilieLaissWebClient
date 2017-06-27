import { SortCriteria } from '../Models/SortCriteria';
import { enSortDirection } from '../Enum/FamilieLaissEnum';

export class SortValueConverter {
    naturalSort(a, b, options) {
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi;
        var sre = /(^[ ]*|[ ]*$)/g;
        var dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
        var hre = /^0x[0-9a-f]+$/i;
        var ore = /^0/;
        var options = options || {};
        var i = function (s) { return options.insensitive && ('' + s).toLowerCase() || '' + s };
        // convert all to strings strip whitespace
        var x = i(a).replace(sre, '') || '';
        var y = i(b).replace(sre, '') || '';
        // chunk/tokenize
        var xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
        var yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
        // numeric, hex or date detection
        var tempX: any = x.match(hre);
        var tempY: any = y.match(hre);
        var xD: any = parseInt(tempX) || (xN.length !== 1 && x.match(dre) && Date.parse(x));
        var yD: any = parseInt(tempY) || xD && y.match(dre) && Date.parse(y) || null;
        var oFxNcL, oFyNcL,
            mult = options.desc ? -1 : 1;
        // first try and sort Hex codes or Dates
        if (yD)
            if (xD < yD) return -1 * mult;
            else if (xD > yD) return 1 * mult;
        // natural sorting through split numeric strings and default strings
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL) ? 1 : -1) * mult; }
            // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
                oFxNcL += '';
                oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) return -1 * mult;
            if (oFxNcL > oFyNcL) return 1 * mult;
        }
        return 0;
    }

    toView(array, properties: SortCriteria) {
        var SortDescending = properties.direction === enSortDirection.Descending ? true : false;
        var PropertyName = properties.propertyName;
        var PropertyArray = [];

        var currentValueA;
        var currentValueB;

        if (PropertyName != null) {
            if (PropertyName.indexOf('.') > -1) {
                PropertyArray = PropertyName.split('.');
            }

            if (PropertyArray.length == 0) {
                return array
                    .slice(0)
                    .sort((a, b) => { return this.naturalSort(a[PropertyName], b[PropertyName], { desc: SortDescending }) });
            }
            else {
                return array
                    .slice(0)
                    .sort((a, b) => { 
                        currentValueA = a;
                        currentValueB = b;

                        var currentItem: any;
                        for (var PropName of PropertyArray)
                        {
                            currentItem = PropName;
                            currentValueA = currentValueA[currentItem];
                            currentValueB = currentValueB[currentItem];
                        }
                        
                        return this.naturalSort(currentValueA, currentValueB, { desc: SortDescending }) 
                    });
            }
        }
    }
}
