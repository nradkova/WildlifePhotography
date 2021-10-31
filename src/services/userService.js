const User = require('../models/User');

async function createUser(firstName, lastName, email, hashedPassword) {
    const user = new User({ firstName, lastName, email, hashedPassword });
    await user.save();
    return user;
}

async function getUserByEmail(email) {
    const match = new RegExp(`^${email}$`);
    const user = await User.findOne({ email: { $regex: match } });
    return user;
}

async function getPostsByUser(id) {
    const user = await User.findById(id).populate('posts').lean();
    user.posts.forEach(x => x.ownerName = `${user.firstName} ${user.lastName}`)
    return user;
}

async function editUser(userId, postId) {
    const user = await User.findById(userId);
    user.posts.push(postId);
    await user.save();
    return user;
}


module.exports = {
    createUser,
    getUserByEmail,
    getPostsByUser,
    editUser
}