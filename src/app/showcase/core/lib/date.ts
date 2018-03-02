export { };

declare global {
    interface Date {
        rsWithTimeZone: () => Date;
    }
}

Date.prototype.rsWithTimeZone = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 60000);
};

