const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');
const logger = require('../utils/logger');

class AuthService {
    async registerUser(userData) {
        const userExists = await userRepository.findByEmail(userData.email);
        if (userExists) {
            throw new Error('User already exists');
        }

        const user = await userRepository.create(userData);
        logger.info(`User registered: ${user.email}`);
        
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        };
    }

    async loginUser(email, password) {
        const user = await userRepository.findByEmail(email);

        if (user && (await user.matchPassword(password))) {
            logger.info(`User logged in: ${user.email}`);
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            };
        } else {
            throw new Error('Invalid email or password');
        }
    }

    async getUserProfile(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = new AuthService();
