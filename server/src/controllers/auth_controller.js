import authService from "#services/auth_service.js";
import ApiError from "#errors/api_error.js";
import validator from "#controllers/properties_validator.js";

function authorizeSuccessHandler(res, token) {
    res.cookie("token", token)
    res.redirect("/")
}

function authorizeErrorHandler(res, error) {
    if (error instanceof ApiError) {
        res.status(400)
        res.json(error)
        return
    }
    res.status(500)
}

export default {

    getRegisterPage(req, res) {
        res.render("register")
    },

    getLoginPage(req, res) {
        res.render("login")
    },

    getLogout(req, res) {
        res.clearCookie("token")
        res.redirect("/login")
    },

    postRegister(req, res) {

        const {name, login, password} = req.body;

        if (!validator.tryValidateParamsOrSendError(req.body, res, "name", "login", "password")) {
            return
        }

        authService.registerAndReturnToken(name, login, password)
            .then(token => authorizeSuccessHandler(res, token))
            .catch(error => authorizeErrorHandler(res, error))
    },

    postLogin(req, res) {

        const {login, password} = req.body;

        if (!validator.tryValidateParamsOrSendError(req.body, res, "login", "password")) {
            return
        }

        authService.tryLoginAndReturnToken(login, password)
            .then(token => authorizeSuccessHandler(res, token))
            .catch(error => authorizeErrorHandler(res, error))
    },

    protectRoute(req, res, routeHandler) {
        const userId = authService.getUserIdByTokenOrNull(req.cookies.token)

        if (!userId) {
            res.status(401)
            res.redirect("/login")
            return
        }

        routeHandler(req, res, userId)
    }
}


