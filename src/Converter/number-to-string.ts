export class NumberToStringValueConverter {
    toView(value: number): string {
        return value.toString();
    }

    fromView(value: string): number {
        return parseInt(value);
    }
}
