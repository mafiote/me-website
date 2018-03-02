export class RsNumberUtils {
    static Round(val: number): number {
        try {
            const numVal = Number(val);
            return numVal === 0 ? 0 : Math.round(numVal * 100) / 100;
        } catch (error) {
            console.log(error);
            return val;
        }
    }
}