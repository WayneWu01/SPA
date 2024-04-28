const md5 = require('md5');

let sessionUser = {};
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
let cookieKey = "sid";
const defaultHeadline = 'defaultHeadline'
const defaultAvatar = 'https://th-thumbnailer.cdn-si-edu.com/bgmkh2ypz03IkiRR50I-UMaqUQc=/1000x750/filters:no_upscale():focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/55/95/55958815-3a8a-4032-ac7a-ff8c8ec8898a/gettyimages-1067956982.jpg'
const users = {}
const config = {
    clientID: '1018503309214434',
    clientSecret: '78344f59e28e44ada31046ca7d890634',
    callbackURL: 'https://ricebookserver222-71c2f6758032.herokuapp.com/facebook/callback',
    profileFields: ['emails']
};
var loggedInUser = '';
const User = require('./schema.js').User
const Profile = require('./schema.js').Profile
const Article = require('./schema.js').Article
function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser
    if (!req.cookies) {
       return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];
    if (!sid) {
        return res.sendStatus(401);
    }

    if(req.path.startsWith("/login") || req.path.startsWith("/register")) {
        return next();
    }

    let username = sessionUser[sid];

    // no username mapped to sid
    if (username) {
        req.username = username;
        next();
    }
    else {
        return res.sendStatus(401)
    }
}
function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    User.find({username: username}).exec()
        .then(user => {
            if (!user || user.length === 0) {
                return res.status(401).send('User not registered');
            }
            var userObj = user[0];
            if(md5(userObj.salt + password) === userObj.hash){
                loggedInUser = username;
                var sessionKey = md5(userObj.username + new Date().getTime());
                sessionUser[sessionKey] = username;
                res.cookie(cookieKey, sessionKey, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
                var msg = { username: username, result: 'success'};
                res.send(msg);
            } else {
                return res.status(401).send('Wrong username or password');
            }
        })
        .catch(err => {
            return res.status(500).send('Error on the server.');
        });
}

function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let tel = req.body.phone;
    let dob = req.body.dob;
    let zipcode = req.body.zipcode;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    User.findOne({ username: username }).exec()
        .then(existingUser => {
            if (existingUser) {
                throw new Error('User already registered');
            }

            let salt = username + new Date().getTime();
            let hash = md5(salt + password);

            let newUser = new User({username: username, salt: salt, hash: hash});
            return newUser.save();
        })
        .then(() => {
            let newProfile = new Profile({
                username: username,
                headline: defaultHeadline,
                email: email,
                zipcode: zipcode,
                phone: tel,
                dob: dob,
                avatar: defaultAvatar,
                following: []
            });

            return newProfile.save();
        })
        .then(() => {
            let msg = {result: 'success', username: username};
            res.status(200).send(msg);
        })
        .catch(err => {
            if (err.message === 'User already registered') {
                return res.status(200).send({result:'registered'})
            } else {
                console.error(err);
                res.status(500).send('Error on the server.');
            }
        });
}
const logout = (req, res) => {
    delete(sessionUser[req.cookies[cookieKey]])
    res.clearCookie(cookieKey)
    res.status(200).send({result:'OK'})
}
// module.exports = { isLoggedIn, login, register };
function setPassword(req, res) {
    const username = req.username;
    const newPassword = req.body.password;

    if (!newPassword) {
        return res.status(400).send({ result: 'Missing new password' });
    }


    User.findOne({ username: username }).exec()
        .then(user => {
            if (!user) {
                return res.status(404).send({ result: 'User not found' });
            }

            const newSalt = username + new Date().getTime();
            const newHash = md5(newSalt + newPassword);

            user.salt = newSalt;
            user.hash = newHash;

            return user.save();
        })
        .then(() => {

            res.status(200).send({ username: username, result: 'success' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ result: 'Error on the server.' });
        });
}
passport.serializeUser(function(user, done){
    users[user.id] = user;
    done(null, user.id)
});

passport.deserializeUser(function(id, done){
    var user = users[id]
    done(null, user)
})

passport.use(new FacebookStrategy(config,
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            return done(null, profile)
        })
    })
)
const facebookLogin = (req, res) => {
    const fbProfile = req.user;
    const fbId = fbProfile.id;
    const fbUsername = fbId + '@' + fbProfile.provider;
    const fbUserEmail = fbProfile.emails ? fbProfile.emails[0].value : '';

    User.findOne({ username: fbUsername }).exec()
        .then(user => {
            if (!user) {
                const salt = fbUsername + new Date().getTime();
                const hash = md5(fbUsername + salt);
                const newUser = new User({ username: fbUsername, salt: salt, hash: hash, auth: [] });

                return newUser.save()
                    .then(() => {
                        const newProfile = new Profile({
                            username: fbUsername,
                            headline: defaultHeadline,
                            email: fbUserEmail,
                            zipcode: '12345',
                            phone: '123-123-1234',
                            dob: '2000-01-13',
                            avatar: defaultAvatar,
                            following: []
                        });

                        return newProfile.save();
                    })
                    .then(() => {
                        generate(fbUsername, res);
                    });
            } else {
                generate(fbUsername, res);
            }
        })
        .catch(err => {

        });
};

function generate(fbUsername, res) {
    const sessionKey = md5(fbUsername + new Date().getTime());
    sessionUser[sessionKey] = fbUsername;
    res.cookie(cookieKey, sessionKey, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
    res.redirect('http://damaging-cattle.surge.sh/#/main');
}

const fail = (req, res) => {
    res.redirect('http://damaging-cattle.surge.sh/#/auth')
}

function updateDb(username, fbUsername, res) {
    let normalProfile;
    let fbProfile;

    Profile.findOne({ username: fbUsername }).exec()
        .then(profile => {
            if (!profile || !profile.following) {
                throw new Error('Facebook user profile does not exist!');
            }
            fbProfile = profile;
            return Profile.findOne({ username: username }).exec();
        })
        .then(profile => {
            if (!profile) {
                throw new Error('normal user profile does not exist');
            }
            normalProfile = profile;

            return Article.updateOne(
                { 'comments.name': fbUsername },
                { $set: { 'comments.$.name': username, 'comments.$.img': normalProfile.avatar } },
                { new: true, multi: true }
            ).exec();
        })
        .then(() => {
            return Article.updateOne(
                { author: fbUsername },
                { $set: { author: username, avatar: normalProfile.avatar } },
                { new: true, multi: true }
            ).exec();
        })
        .then(() => {
            const fbFollowings = fbProfile.following;
            const normalFollowings = normalProfile.following;
            const mergeFollowings = merge(normalFollowings, fbFollowings, username);

            return Profile.findOneAndUpdate(
                { username: username },
                { $set: { following: mergeFollowings } },
                { new: true }
            ).exec();
        })
        .then(() => {
            return User.findOneAndUpdate(
                { username: username },
                { $addToSet: { auth: { 'facebook': fbUsername } } },
                { new: true }
            ).exec();
        })
        .then(() => {
            return User.deleteOne({ username: fbUsername }).exec();
        })
        .then(() => {
            return Profile.deleteOne({ username: fbUsername }).exec();
        })
        .then(() => {
            res.status(200).send({ result: 'success' });
        })
        .catch(err => {
            console.error(err);
            res.status(400).send(err.message);
        });
}
function link(req, res, next) {
    const fbUsername = req.username;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: 'Missing username or password' });
    }

    User.findOne({ username: username }).exec()
        .then(normalUser => {
            if (!normalUser) {
                res.status(404).send({ error: 'No such user' });
                throw new Error('BreakChain');
            }

            if (md5(normalUser.salt + password) !== normalUser.hash) {
                res.status(401).send({ error: 'Wrong password' });
                throw new Error('BreakChain');
            }

            if (normalUser.auth && normalUser.auth.length > 0) {
                res.status(200).send({ message: 'Already linked' });
                throw new Error('BreakChain');
            }

            return User.findOne({ username: fbUsername }).exec();
        })
        .then(fbUser => {
            if (!fbUser) {
                res.status(404).send({ error: 'No Facebook login found' });
                throw new Error('BreakChain');
            }

            return updateDb(username, fbUsername, res);
        })
        .then(() => {
            res.status(200).send({ message: 'Link successful' });
        })
        .catch(err => {
            if (err.message !== 'BreakChain') {
                console.error(err);
                res.status(500).send({ error: 'Server error' });
            }
        });
}
function unlink(req, res) {
    const username = req.username;

    User.findOne({ username: username }).exec()
        .then(user => {

            return User.findOneAndUpdate({ username: username }, { $set: { auth: [] } }, { new: true }).exec();
        })
        .then(updatedUser => {
            if (updatedUser) {
                res.status(200).send({ result: 'success' });
            } else {
                res.status(400).send('unlink failed');
            }
        })
        .catch(err => {
            if (err.message !== 'StopExecution') {
                console.error(err);
                res.status(500).send('Server error');
            }
        });
}

function merge(normalFollow, fbFollowings, username) {
    let res = []
    for(let i=0; i < normalFollow.length; i++) {
        res.push(normalFollow[i])
    }
    for(let i=0; i < fbFollowings.length; i++){
        let exist = false;
        for(let j=0; j < normalFollow.length; j++){
            if(fbFollowings[i] == normalFollow[j] || fbFollowings[i] == username) {
                exist = true;
                break;
            }
        }
        if(!exist){
            res.push(fbFollowings[i])
        }
    }
    return res;
}
module.exports = (app) => {

    app.use(cookieParser())
    app.post("/login", login)
    app.post("/register", register)
    app.use(session({secret: 'thisIsMySecretMessageHowWillYouGuessIt'}));
    app.use(passport.initialize())
    app.use(passport.session())
    app.get("/facebook/login", passport.authenticate('facebook', { scope: ['email'] }));
    app.get("/facebook/callback", passport.authenticate('facebook', { successRedirect: '/fbLogin', failureRedirect: '/fail' }));
    app.get("/fbLogin", facebookLogin );
    app.use("/fail", fail)
    app.use(isLoggedIn)

    app.put('/link', link);
    app.get('/unlink', unlink);
    app.put('/logout', logout);
    app.put('/password', setPassword);
};

