import userRepository from "#repositories/user_repository.js";

export default {
    async getUserProfileInfoById(id) {
        const user = await userRepository.findUserById(id);

        if (user == null) {
            return null
        }

        return {id: user.id, name: user.name, login: user.login}
    }
}