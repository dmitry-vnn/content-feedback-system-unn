class ApiError {
    error

    constructor(error) {
        this.error = error;
    }

    get error() {
        return this.error;
    }
}

export default ApiError