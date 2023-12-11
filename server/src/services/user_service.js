import userRepository from "#repositories/user_repository.js";

export default {
    async getUserNameById(id) {
        const user = await userRepository.findUserById(id);
        return user?.name
    }
}