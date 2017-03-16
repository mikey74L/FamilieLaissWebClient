/**
 * Returns a supplied numeric file size in bytes converted to the most matching size in text format (KB, MB, GB, TB).
 * @param size The value in Bytes to be converted to a size string.
*/
export function SizeToString(size: number): string {
  if (size < 1024) {
    //Es handelt sich um eine Größe im Byte-Bereich
    return size.toString() + ' Bytes';
  }
  else {
    if (size < 1048576) {
      //Es handelt sich um eine Größe im Kilobyte-Bereich
      return RoundWithPlaces(size / 1024, 2) + ' KB';
    }
    else {
      if (size < 1073741824) {
        //Es handelt sich um eine Größe im Megabyte-Bereich
        return RoundWithPlaces(size / 1024 / 1024, 2) + ' MB';
      }
      else {
        if (size < 1099511627776) {
          //Es handelt sich um eine Größe im Gigabyte-Bereich
          return RoundWithPlaces(size / 1024 / 1024 / 1024, 2) + ' GB';
        }
        else {
          //Es handelt sich um eine Größe im Terrabyte-Bereich
          return RoundWithPlaces(size / 1024 / 1024 / 1024 / 1024, 2) + ' TB';
        }
      }
    }
  }
}

/**
 * Rounds a number to the specified decimal places
 * @param value The number that have to be converted.
 * @param places The count of decimal places.
*/
export function RoundWithPlaces(value: number, places: number): number {
  return + (Math.round(parseFloat(value + "e+" + places))  + "e-" + places);
}

export function ExtractFilename(filenameComplete: string): string {
  return filenameComplete.substr(0, filenameComplete.lastIndexOf('.'));
}

export function ExtractExtension(filenameComplete: string): string {
  return filenameComplete.substr(filenameComplete.lastIndexOf('.') + 1);
}
