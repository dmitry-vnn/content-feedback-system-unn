import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import authController from "#controllers/auth_controller.js";
import homeController from "#controllers/home_controller.js";
import contentController from "#controllers/content_controller.js";

const app = express();

(function main() {
    configureExpress()
    configureRoutes()

    app.listen(8080)
})()

function configureExpress() {
    app.use(cookieParser())

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(express.static("../templates/"))

    app.set("view engine", "ejs");
    app.set("views", "../templates")
}


function configureRoutes() {
    app.get("/register", authController.getRegisterPage)
    app.get("/login", authController.getLoginPage)

    app.post("/register", authController.postRegister)
    app.post("/login", authController.postLogin)
    app.get("/logout", authController.getLogout)


    app.get("/", (req, res) =>
        authController.protectRoute(req, res, homeController.getHomePage))


    app.get("/content", (req, res) =>
        authController.protectRoute(req, res, contentController.getContentPage)
    )

    app.post("/content", (req, res) =>
        authController.protectRoute(req, res, contentController.postContent))
    app.get("/feedback", (req, res) =>
        authController.protectRoute(req, res, contentController.getFeedbackPage)
    )

    app.get("/api/content", (req, res) =>
        authController.protectRoute(req, res, contentController.getContent)
    )
    app.get("/api/review", (req, res) =>
        authController.protectRoute(req, res, contentController.getReviewContent)
    )
    app.post("/api/feedback", (req, res) =>
        authController.protectRoute(req, res, contentController.postFeedback)
    )

}





