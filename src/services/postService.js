const Post = require('../models/Post');
const User = require('../models/User');

async function createOne(post) {
    const current = new Post({ ...post });
    await current.save();
    return current;
}

async function getOneById(id) {
    const current = await Post.findById(id)
        .populate({ path: 'votes', select: 'email' })
        .populate('owner')
        .lean();
    if (current) {
        const viewModel = {
            _id: current._id,
            title: current.title,
            keyword: current.keyword,
            location: current.location,
            date: current.date,
            imageUrl: current.imageUrl,
            description: current.description,
            ownerId: current.owner._id.toString(),
            ownerName: `${current.owner.firstName} ${current.owner.lastName}`,
            votes: current.votes.map(x=>x.email),
            rating: current.rating
        }
        return viewModel;
    }
    return undefined;
}

async function editOne(id, post) {
    const current = await Post.findById(id);
    if (!current) {
        throw new ReferenceError('No such data');
    }
    Object.assign(current, post);
    return await current.save();
}

async function delOne(id) {
    const current = await Post.findById(id);
    if (!current) {
        throw new ReferenceError('No such data');
    }
    return await Post.deleteOne({ _id: id });
}

async function getAll() {
    return await Post.find({}).lean();
}

async function likePost(postId, userId) {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
        throw new ReferenceError('No such data');
    }
    post.votes.push(userId);
    post.rating+=1;
    user.voted.push(postId)
    return Promise.all([post.save(), user.save()]);
}

async function dislikePost(postId, userId) {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
        throw new ReferenceError('No such data');
    }
    post.votes.push(userId);
    post.rating-=1;
    user.voted.push(postId)
    return Promise.all([post.save(), user.save()]);
}

module.exports = {
    createOne,
    getOneById,
    editOne,
    delOne,
    getAll,
    likePost,
    dislikePost
}