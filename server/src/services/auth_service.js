import userRepository from "#repositories/user_repository.js";
import ApiError from "#errors/api_error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const jwtPrivateKey = "SUPER_TOP_SECRET_KEY"

function createJwtTokenByUserId(id) {
    return jwt.sign({userId: id}, jwtPrivateKey);
}


async function hash(password) {
    return await bcrypt.hash(password, 0);
}

export default {
    async registerAndReturnToken(name, login, password) {
        const isUserExists = await userRepository.isUserExists(login)
        if (isUserExists) {
            throw new ApiError("Пользователь уже существует")
        }

        const hashedPassword = await hash(password);

        const id = await userRepository.createUser(
            login, hashedPassword, name
        )

        return createJwtTokenByUserId(id)
    },

    async tryLoginAndReturnToken(login, password) {
        const user = await userRepository.findUserByLogin(login)
        if (user == null) {
            throw new ApiError("Пользователя не существует")
        }

        const isSuccess = bcrypt.compareSync(password, user.password)

        if (!isSuccess) {
            throw new ApiError("Неверный пароль :(")
        }

        return createJwtTokenByUserId(user.id);
    },

    getUserIdByTokenOrNull(token) {

        if (!token) {
            return null
        }

        try {
            const decoded = jwt.verify(token, jwtPrivateKey)
            return decoded.userId;
        } catch (error) {
            return null
        }

    },
}