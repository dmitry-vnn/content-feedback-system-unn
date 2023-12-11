import userService from "#services/user_service.js";

export default {

    getHomePage(req, res, userId) {
        userService.getUserNameById(userId).then(userName =>
            res.render("home", {userName: userName})
        )
    },
}


