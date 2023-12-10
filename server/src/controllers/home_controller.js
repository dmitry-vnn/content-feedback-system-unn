import userService from "#services/user_service.js";

export default {

    async getHome(req, res, userId) {
        const user = await userService.getUserProfileInfoById(userId);

        res.render("home", {user: user})
    },
}


