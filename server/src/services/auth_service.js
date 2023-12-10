import userRepository from "#repositories/user_repository.js";
import ApiError from "#errors/api_error.js";

export default {
    async register(name, login, password) {

        const isUserExists = await userRepository.isUserExists(login)
        if (isUserExists) {
            throw new ApiError("Пользователь уже существует")
        }
        return await userRepository.createUser(login, password, name)
    },

    async findUserByLogin(login) {
        return await userRepository.findUserByLogin(login)
    }
}