class ApiError {
    error;

    constructor(error) {
        this.error = error;
    }

    get error() {
        return this.error;
    }

    toJson() {
        return JSON.stringify({error: this.error})
    }
}

export default ApiError