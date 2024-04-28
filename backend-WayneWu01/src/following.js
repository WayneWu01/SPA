const Profile = require('./schema.js').Profile

function getFollowing(req, res) {
    const username = req.params.user?req.params.user:req.username;

    Profile.findOne({ username: username }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'User not found.' });
            }
            res.status(200).send({ username: username, following: profile.following });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error fetching following list' });
        });
}
function Follow(req, res) {
    const loggedInUser = req.username;
    const userToFollow = req.params.user;

    Profile.findOne({ username: userToFollow }).exec()
        .then(newFollowingPro => {
            if (!newFollowingPro) {
                return res.status(404).send({ error: `User ${userToFollow} not found.` });
            }
            return Profile.findOne({ username: loggedInUser }).exec();
        })
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'Logged-in user profile not found.' });
            }

            if (!profile.following.includes(userToFollow)) {
                profile.following.push(userToFollow);
                return profile.save();
            } else {
                return profile;
            }
        })
        .then(profile => {
            res.status(200).send({ username: loggedInUser, following: profile.following });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating following list' });
        });
}


function unFollow(req, res) {
    const loggedInUser = req.username;
    const userToUnfollow = req.params.user;

    Profile.findOne({ username: loggedInUser }).exec()
        .then(profile => {
            if (!profile) {
                return res.status(404).send({ error: 'Logged-in user not found.' });
            }

            const index = profile.following.indexOf(userToUnfollow);
            if (index > -1) {
                profile.following.splice(index, 1);
                return profile.save();
            } else {

                return profile;
            }
        })
        .then(profile => {

            res.status(200).send({ username: loggedInUser, following: profile.following });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Error updating following list' });
        });
}
const getFollowingsP = async (req, res) => {
    try {
        const profile = await Profile.findOne({ username: req.username }).exec();
        if (!profile) {
            return res.status(400).send('No profile followings');
        }

        const following = profile.following;
        if (!following || following.length === 0) {
            return res.status(200).send({ profiles: [] });
        }

        const profiles = await Profile.find({ username: { $in: following } }).exec();
        res.status(200).send({ profiles: profiles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

module.exports = (app) => {
    app.get('/following/:user?', getFollowing)
    app.put('/following/:user', Follow)
    app.delete('/following/:user', unFollow)
    app.get('/followingProfile', getFollowingsP)
}
