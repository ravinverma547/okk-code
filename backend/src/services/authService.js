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

            if (!user) {
                console.log(`❌ User not found in database: ${email}. The production database might be empty. Please register first.`);
                const error = new Error('User not registered in this database');
                error.statusCode = 401;
                throw error;
            }

            if (await user.matchPassword(password)) {
                console.log(`✅ Password match for: ${email}`);
                
                // Auto-promote first user to ADMIN if no admins exist
                const adminCount = await require('../models/User').countDocuments({ role: 'ADMIN' });
                if (adminCount === 0) {
                    user.role = 'ADMIN';
                    await user.save();
                    console.log(`🚀 First user Auto-Promoted to ADMIN: ${user.email}`);
                }

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
                console.log(`❌ Invalid password for: ${email}`);
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                throw error;
            }
        } catch (error) {
            console.error(`💥 Login Error Service: ${error.message}`);
            throw error;
        }
    }

    async updateProfile(id, updateData) {
        const user = await userRepository.findByIdWithPassword(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if (updateData.name) user.name = updateData.name;
        
        // If it's a student, update their student profile phone too
        if (user.role === 'STUDENT' && user.studentProfile) {
            const Student = require('../models/Student');
            await Student.findByIdAndUpdate(user.studentProfile._id, { phone: updateData.phone });
        }

        const updatedUser = await user.save();
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        };
    }

    async updatePassword(id, oldPassword, newPassword) {
        const user = await userRepository.findByIdWithPassword(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            const error = new Error('Incorrect current password');
            error.statusCode = 401;
            throw error;
        }

        user.password = newPassword;
        await user.save();
        return { message: 'Password updated successfully' };
    }
}

module.exports = new AuthService();
