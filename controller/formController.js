const Sentiment = require('sentiment');
const Post = require('../model/Post');

exports.handleSubmit = (req, res) => {
    res.render('form', {
        msg: 'something to test'
    })
}

//get all the analysised words
exports.AfterSubmit = (req, res) => {
    const post = req.body.texts;

    //checking post or not submitted
    if (post.length > 0) {
        const sentiment = new Sentiment()
        const result = sentiment.analyze(post);

        const { score, comparative, tokens, words, positive, negative } = result;

        if (result.negative.length > 3) {

            //failed sentimental analysis
            res.render('sucess', {
                score,
                comparative,
                tokens,
                words,
                positive,
                negative,
                msg: 'Words are not above our quality standard'

            })
        } else {

            //passed sentimental analysis
            const newPost = new Post({
                content: post
            })
            
            newPost.save().then(() => {
                res.render('sucess', {
                    score,
                    comparative,
                    tokens,
                    words,
                    positive,
                    negative,
                    msg: 'Saved...'
                })

                //adding new words in new database
                let allWords = tokens;
                let remainingWords = words.concat(positive, negative);
                
                remainingWords.forEach(e => {
                    let i = allWords.indexOf(e);
                    if (i != -1) {
                        allWords.splice(i, 1)
                    }
                });
            }).catch(err => console.error(err));
        }

    } else {
        //enter words to check
        res.render('sucess', {
            msg: 'please type anything'
        })
    }
}