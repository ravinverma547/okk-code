const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');
const logger = require('../utils/logger');

class AuthService {
    async registerUser(userData) {
        const userExists = await userRepository.findByEmail(userData.email);
        if (userExists) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
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
        console.log(`🔐 Attempting login for: ${email}`);
        try {
            const user = await userRepository.findByEmail(email);
            console.log(`👤 User found: ${user ? 'Yes' : 'No'}`);

            if (user && (await user.matchPassword(password))) {
                console.log(`✅ Password match for: ${email}`);
                logger.info(`User logged in: ${user.email}`);
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    studentProfile: user.studentProfile ? (user.studentProfile._id || user.studentProfile) : null,
                    token: generateToken(user._id)
                };
            } else {
                console.log(`❌ Invalid credentials for: ${email}`);
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                throw error;
            }
        } catch (error) {
            console.error(`💥 Login Error Service: ${error.message}`);
            throw error;
        }
    }

    async getUserProfile(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}

module.exports = new AuthService();
