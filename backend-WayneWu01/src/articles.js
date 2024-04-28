const Article = require('./schema.js').Article;
const Profile = require('./schema.js').Profile;
const mongoose = require('mongoose');
const addArticle = (req, res) => {
    const img = req.body.image ? req.body.image : '';

    Profile.findOne({ username: req.username }).exec()
        .then(profile => {
            if (!profile) {
                throw new Error('Profile not found');
            }
            const avatar = profile.avatar;
            var newArticle = new Article({
                id: Math.floor(Math.random() * 1000000),
                username: req.username,
                text: req.body.text,
                img: img,
                avatar: avatar,
                date: new Date(),
                comments: []
            });
            return newArticle.save();
        })
        .then(article => {
            res.status(200).send({ articles: [article] });
        })
        .catch(err => {
            // Handle errors
            console.error(err);
            res.status(500).send({ error: 'Error saving article' });
        });
};

function getArticles(req, res) {
    const input = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (input) {
        if (mongoose.Types.ObjectId.isValid(input) && new mongoose.Types.ObjectId(input).toString() === input) {

            Article.find({ _id: input }).exec()
                .then(articlesById => {
                    if (articlesById.length > 0) {
                        res.status(200).send({ articles: articlesById });
                    } else {
                        return Article.find({ username: input }).exec();
                    }
                })
                .then(articlesByUsername => {
                    if (articlesByUsername) {
                        if (articlesByUsername.length === 0) {
                            res.status(404).send({ error: 'No articles found' });
                        } else {
                            res.status(200).send({ articles: articlesByUsername });
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({ error: 'Error fetching articles' });
                });
        } else {
            Article.find({ username: input }).exec()
                .then(articlesByUsername => {
                    if (articlesByUsername.length > 0) {
                        res.status(200).send({ articles: articlesByUsername });
                    } else {
                        res.status(404).send({ error: 'No articles found' });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({ error: 'Error fetching articles' });
                });
        }
    } else {
        Profile.findOne({ username: req.username }).exec()
            .then(profile => {
                if (!profile) {
                    return res.status(404).send({ error: 'Profile not found.' });
                }

                let followings = profile.following;
                followings.push(req.username);

                return Article.find({ username: { $in: followings } }).sort({ date: -1 }).skip(skip).limit(limit).exec();
            })
            .then(feeds => {
                if (feeds.length === 0) {
                    res.status(404).send({ error: 'No articles found in feed' });
                } else {
                    res.status(200).send({ articles: feeds });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({ error: 'Error fetching articles' });
            });
    }
}



function putArticles(req, res) {
    const postId = req.params.id;
    const text = req.body.text;
    const commentId = req.body.commentId;

    Profile.find({ username: req.username }).exec()
        .then(profiles => {
            const userAvatar = profiles[0].avatar;

            if (!commentId) {
                return Article.updateOne({ _id: postId }, { $set: { text: text } }, { new: true }).exec();
            } else {
                if (commentId === -1) {
                    return Article.updateOne({ _id: postId }, {
                        $push: {
                            comments: {
                                name: req.username,
                                text: text,
                                img: userAvatar
                            }
                        }
                    }, { new: true }).exec();
                } else {
                    return Article.updateOne({ _id: postId, "comments._id": commentId }, { $set: { "comments.$.text": text } }, { new: true }).exec();
                }
            }
        })
        .then(article => {
            res.status(200).send({ articles: [article] });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
}


module.exports = (app) => {
    app.post('/article', addArticle);
    app.get('/articles/:id?', getArticles)
    app.put('/articles/:id', putArticles)
}
