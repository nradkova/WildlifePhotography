const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SALT_ROUNDS, TOKEN_SECRET, COOKIE_NAME } = require('../config/config.json')[process.env.NODE_ENV];
const{createUser,getUserByEmail}=require('../services/userService')

const authMiddleware = () => (req, res, next) => {
    if (parseToken(req, res)) {
        req.auth = {
            async register(firstName,lastName,email,password) {
                const token=await register(firstName,lastName,email,password);
                res.cookie(COOKIE_NAME,token);
            },
            async login(email,password){
                const token=await login(email,password);
                res.cookie(COOKIE_NAME,token);
            },
            logout(){
                res.clearCookie(COOKIE_NAME);
            }
        }

        next();
    }
}

module.exports = authMiddleware;

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
        try {
            const user = jwt.verify(token, TOKEN_SECRET);
            req.user = user;
            res.locals.user=user; 
        } catch (error) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('auth/login');
            return false;
        }
    }
    return true;
}

function generateToken(user) {
    return jwt.sign({
        _id: user.id,
        email: user.email,
        // username: user.username,
    }, TOKEN_SECRET);
}

async function register(firstName,lastName,email, password){
    const existing=await getUserByEmail(email);
    // const existing=await getUserByUsername(username);

    if(existing){
        throw new Error('User with such email already exists!')
    }

    const hashedPassword= await bcrypt.hash(password,SALT_ROUNDS);

    const user=await createUser(firstName,lastName,email,hashedPassword);
    return generateToken(user);
}

async function login(email,password){
     const user=await getUserByEmail(email);
    //  const user=await getUserByUsername(username);
     if(!user){
         throw new Error ('User with such email does not exist!')
     }
     const hasMatch=await bcrypt.compare(password,user.hashedPassword);
     if(!hasMatch){
         throw new Error('Invalid email or password!')
        //  throw new Error('Invalid username or password!')
     }
     return generateToken(user);
}