import ApiError from "#errors/api_error.js";

function sendErrorResponse(res) {
    res.status(400)
    res.json(new ApiError("Не все параметры были переданы"))
}

export default {
    tryValidateParamsOrSendError(validateObject, res, ...params) {
        if (!validateObject) {
            sendErrorResponse(res)
            return false
        }
        for (let param of params) {
            if (!validateObject[param]) {
                sendErrorResponse(res);
                return false
            }
        }
        return true
    }
}