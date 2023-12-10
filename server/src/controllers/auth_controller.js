import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authService from "#services/auth_service.js";
import ApiError from "#errors/api_error.js";

const tokenPrivateKey = "SUPER_TOP_SECRET_KEY"

function createJwtTokenByUserId(id) {
    return jwt.sign({userId: id}, tokenPrivateKey);
}


async function hash(password) {
    return await bcrypt.hash(password, 0);
}

export default {

    async getRegister(req, res) {
        res.render("register")
    },

    async getLogin(req, res) {
        res.render("login")
    },

    async postRegister(req, res) {
        const {name, login, password} = req.body;

        if (!(name && login && password)) {
            res
                .status(500)
                .json(new ApiError("Не все параметры были переданы!"))
            return
        }

        const hashedPassword = await hash(password);

        authService.register(name, login, hashedPassword)
            .then(id => {
                res.cookie("token", createJwtTokenByUserId(id))
                res.redirect("/")
            })
            .catch(error => {
                res.status(500)
                if (error instanceof ApiError) {
                    res.json(error)
                }
            })
    },

    async postLogin(req, res) {
        const {login, password} = req.body;

        if (!(login && password)) {
            res
                .status(500)
                .json(new ApiError("Не все параметры были переданы!"))
            return
        }

        const user = await authService.findUserByLogin(login)

        if (user == null) {
            res
                .status(500)
                .json(new ApiError("Пользователя не существует"))
            return
        }

        bcrypt.compare(password, user.password, (err, isSuccess) => {
            if (!isSuccess) {
                res
                    .status(500)
                    .json(new ApiError("Неверный пароль :("))
                return
            }
            res.cookie("token", createJwtTokenByUserId(user.id))
            res.redirect("/")
        })
    },

    protectRoute(req, res, routeHandler) {

        const token = req.cookies.token;

        if (!token) {
            res.status(401)
            res.redirect("/login")
            return
        }

        jwt.verify(token, tokenPrivateKey, (error, decoded) => {

            if (error) {
                res.status(401)
                res.redirect("/login")
                return
            }

            const userId = decoded.userId

            //next pipe
            routeHandler(req, res, userId)

        })

    },

    getLogout(req, res) {
        res.clearCookie("token")
        res.redirect("/login")
    }
}


