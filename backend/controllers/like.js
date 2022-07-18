const Sauce = require('../model/sauce');

exports.likeSauce = (req, res, next) => {
    console.log("-->CONTENU req.body.like - ctrl like")
    console.log(req.body.like)

    console.log("-->CONTENU req.body.userId - ctrl user")
    console.log(req.body.userId)

    console.log('--> id en _id')
    console.log({ _id: req.params.id })

    Sauce.findOne({ _id: req.params.id })
        .then((sauceObject) => {

            if (!sauceObject.usersLiked.includes(req.body.userId) && !sauceObject.usersDisliked.includes(req.body.userId) && req.body.like === 1) {

                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                ).then()(res.status(201).json({ message: "sauce likée" })
                ).catch((error) => res.status(500).json({ error }));

            } else if (sauceObject.usersLiked.includes(req.body.userId) && req.body.like === 0) {

                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                ).then()(res.status(201).json({ message: "Annulation like" })
                ).catch((error) => res.status(500).json({ error }));
                
            } else if (!sauceObject.usersDisliked.includes(req.body.userId) && !sauceObject.usersLiked.includes(req.body.userId) && req.body.like === -1) {

                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId }
                    }
                ).then()(res.status(201).json({ message: "sauce dislikée" })
                ).catch((error) => res.status(500).json({ error }));

            } else if (sauceObject.usersDisliked.includes(req.body.userId) && req.body.like === 0) {

                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId }
                    }
                ).then()(res.status(201).json({ message: "Annulation dislike" })
                ).catch((error) => res.status(500).json({ error }));
            } else {
                res.status(400).json({ message: 'bad request' })
            }

        }).catch((error) => res.status(404).json({ error }))
}