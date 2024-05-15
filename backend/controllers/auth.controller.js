import User from '../models/auth.model.js'
import bcrypt from 'bcrypt'
import validator from 'validator'

export const singup = async (request, response) => {
    const { userName, fullName, password, confirmPassword, gender, profilePic } =
        request.body

    // Check if fields empty
    if (!userName ||
        !fullName ||
        !password ||
        !confirmPassword ||
        !gender ||
        !profilePic) {
        return response
            .status(404)
            .send({ error: "Please fill all required fields" })
    }

    // Check if passwod is strong
    if (!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
    })) {
        return response
            .status(404)
            .send({ error: "Your password is not strong" })
    }

    // Check confirm password
    if (confirmPassword !== password) {
        return response
            .status(404)
            .send({ error: "Password and confirm password do not match" })
    }

    // Check if username alredy exits
    const existingUser = await User.findOne({ userName })


    if (existingUser) {
        return response
            .status(404)
            .send({ error: "Username alredy in use" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        fullName,
        userName,
        password: hashedPassword,
        gender,
        profilePic,
    });

    if (!newUser) {
        return response.status(404).send({ error: "User not created" })
    }
}
export const signin = async (request, response) => {
    const {
        userName,
        password
    } = request.body

    // Check empty fields
    if (!userName || !password) {
        return response
            .status(404).send({
                error: "Please fill all required fields"
            })
    }

    const user = await User.findOne({
        userName
    })

    let isCorrectPassword;

    // Check password is correct
    if (user) {
        isCorrectPassword = await bcrypt.compare(password, user?.password)

    }
    if (!isCorrectPassword || !user) {
        return response.status(404).send({
            error: "Incorrect password or username"
        })
    }
    generateTokenAndSetCookie(user._id, response)
    response.status(200).send(user)
};
export const logout = async (request, response) => {
    response.cookie("jwt", "");
    response.status(200).send({ message: "Logged out successfully" })

};