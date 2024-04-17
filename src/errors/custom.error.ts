export class CustomError implements Error {
    public name: string;
    public message: string;
    public stack?: string;

    constructor(message: string) {
        this.name = 'CustomError';
        this.message = message;
    }
}