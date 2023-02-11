import ApiExeption from "../exeptions/api.exeption.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    if (err instanceof ApiExeption) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: 'Unexpected error' });
}
export default errorMiddleware;