const Profile = require('./schema.js').Profile
const uploadImage = require('./uploadCloudinary.js')

const getProfile = (req, res) => {
    const username = req.params.user ? req.params.user : req.username;

    Profile.find({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'No profile found' });
            }
            res.status(200).send({ username: username, profile: profile });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user profile' });
        });
};

function getHeadline(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }
            res.status(200).send({ username: username, headline: profile.headline });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user headline' });
        });
}

function setHeadline(req, res) {
    const loggedInUser = req.username;
    const newHeadline = req.body.headline;

    Profile.findOne({ username: loggedInUser }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }

            profile.headline = newHeadline;
            return profile.save();
        })
        .then(() => {
            res.status(200).send({ username: loggedInUser, headline: newHeadline });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating user headline' });
        });
}

function getEmail(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }
            res.status(200).send({ username: username, email: profile.email });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user email' });
        });
}
function setEmail(req, res) {
    const loggedInUser = req.username;
    const newE = req.body.email;

    Profile.findOne({ username: loggedInUser }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }

            profile.email = newE;
            return profile.save();
        })
        .then(() => {
            res.status(200).send({ username: loggedInUser, email: newE });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating user email' });
        });
}
function getZipcode(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }
            res.status(200).send({ username: username, zipcode: profile.zipcode });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user zipcode' });
        });
}
function setZipcode(req, res) {
    const loggedInUser = req.username;
    const newZ = req.body.zipcode;

    Profile.findOne({ username: loggedInUser }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }

            profile.zipcode = newZ;
            return profile.save();
        })
        .then(() => {
            res.status(200).send({ username: loggedInUser, zipcode: newZ });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating user zipcode' });
        });
}

function getAvatar(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }
            res.status(200).send({ username: username, avatar: profile.avatar });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user avatar' });
        });
}
function setAvatar(req, res) {
    const loggedInUser = req.username;
    const newA = req.body.avatar;

    Profile.findOne({ username: loggedInUser }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }

            profile.avatar = newA;
            return profile.save();
        })
        .then(() => {
            res.status(200).send({ username: loggedInUser, avatar: newA });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating user avatar' });
        });
}
function getPhone(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }
            res.status(200).send({ username: username, phone: profile.phone });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user phone number' });
        });
}
function setPhone(req, res) {
    const loggedInUser = req.username;
    const newP = req.body.phone;

    Profile.findOne({ username: loggedInUser }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }

            profile.phone = newP;
            return profile.save();
        })
        .then(() => {
            res.status(200).send({ username: loggedInUser, phone: newP });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating user phone number' });
        });
}
function getDob(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile || !profile.dob) {
                return res.status(404).send({ error: 'User or date of birth not found.' });
            }
            const cdob = profile.dob;
            res.status(200).send({ username: username, dob: Date.parse(cdob) });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching user date of birth' });
        });
}

const getUrl = (req, res) => {
    if (req.fileurl) {
        res.status(200).send({img: req.fileurl});
    }
    else {
        res.status(200).send({img: ''});
    }
}

module.exports = (app) => {
    app.get('/profile/:user?', getProfile)
    app.get('/headline/:users?', getHeadline)
    app.put('/headline', setHeadline)
    app.get('/email/:user?', getEmail)
    app.put('/email', setEmail)
    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', setZipcode)
    app.get('/avatar/:user?', getAvatar)
    app.put('/avatar', setAvatar)
    app.put('/uploadAvatar',uploadImage('avatar'), getUrl)
    app.get('/phone/:user?', getPhone)
    app.put('/phone', setPhone)
    app.get('/dob/:user?', getDob)
}
