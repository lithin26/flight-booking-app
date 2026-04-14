import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import {User} from "../models/UserSchema.js"

export const Register = async (req, res) => {
    const { username, email, usertype, password } = req.body;
    let approval = 'approved';
    if (!username || !email || !usertype || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        console.time('DB_Lookup');
        const existingUser = await User.findOne({ email });
        console.timeEnd('DB_Lookup');
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (usertype === 'flight-operator') {
            approval = 'not-approved';
        }
        console.time('Password_Hash');
        const hashedPassword = await bcrypt.hash(password, 8);
        console.timeEnd('Password_Hash');
        const newUser = new User({
            username,
            email,
            usertype,
            password: hashedPassword,
            approval
        });
        const userCreated = await newUser.save();
        const payload = {
            id: userCreated._id,
            username: userCreated.username,
            email: userCreated.email,
            usertype: userCreated.usertype,
            approval: userCreated.approval
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );
        return res.status(201).json({
            message: "Account Created",
            user: payload,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};
export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.time('Login_DB_Lookup');
        const user = await User.findOne({ email });
        console.timeEnd('Login_DB_Lookup');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.time('Password_Compare');
        const isMatch = await bcrypt.compare(password, user.password);
        console.timeEnd('Password_Compare');
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            usertype: user.usertype,
            approval: user.approval
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        return res.json({
            user: payload,
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}