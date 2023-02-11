export default class ApiExeption extends Error {
    constructor(status, message, erros = []){
        super();
        this.status = status;
        this.message = message;
        this.errors = erros;
    }

    static BadRequest(message, errors = []) {
        return new ApiExeption(400, message, errors);
    }
}