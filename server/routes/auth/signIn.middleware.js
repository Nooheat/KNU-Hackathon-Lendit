let User = require('../../database/models/user');
let Admin = require('../../database/models/admin');

const jwt = require('jsonwebtoken');
const secret = 'zxmkjuinnhnkrngcniun128';
exports.userSignIn = (req, res, next) => {
    if (req.params.type !== 'user') return next();

    const email = req.body.email;
    const password = req.body.password;

    User.findOneByEmail(email)
        .then((user) => {
            if (!user) next();
            else {
                if (user.verify(password)) return user;
                else return next();
            }
        })
        .then(createJWT)
        .then((token) => {
            res.status(201).json({
                "token": token
            });
        })
        .catch((err) => {
            res.status(400).json({
                "message": err.message
            });
        })
}


exports.adminSignIn = (req, res, next) => {
    if (req.params.type !== 'admin') return next();

    const email = req.body.email;
    const password = req.body.password;

    Admin.findOneByEmail(email)
        .then((admin) => {
            console.log(admin);
            if (!admin) return next();
            else {
                if (admin.verify(password)) return admin;
                else return next();
            }
        })
        .then(createJWT)
        .then((token) => {
            res.status(201).json({
                "token": token
            });
        })
        .catch((err) => {
            res.status(400).json({
                "message": err.message
            });
        })

}

function createJWT(payload) {
    payload._doc.__v = undefined;
    payload._doc.password = undefined;
    payload._doc.isAdmin = payload._doc._agency !== undefined;
    console.dir(payload);
    const p = new Promise((resolve, reject) => {
        jwt.sign(payload._doc,
            secret, {
                expiresIn: '7d',
                issuer: "lendit.com",
                subject: 'userInfo'
            }, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
    })
    return p;
}