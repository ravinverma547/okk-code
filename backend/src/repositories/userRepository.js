const User = require('../models/User');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email }).populate('studentProfile');
    }

    async findById(id) {
        return await User.findById(id).select('-password').populate('studentProfile');
    }

    async findByIdWithPassword(id) {
        return await User.findById(id).populate('studentProfile');
    }

    async create(userData) {
        return await User.create(userData);
    }

    async createWithSession(userData, session) {
        return await User.create([userData], { session });
    }
}

module.exports = new UserRepository();
