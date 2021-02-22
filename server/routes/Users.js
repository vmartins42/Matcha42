var express = require('express')
var router = express.Router()
var connection = require('../database/db')
var bcrypt = require('bcryptjs')
var sendEmail = require('../utils/sendEmail.js')
var sendEmailReport = require('../utils/sendEmailReport.js')
var crypto = require('crypto')

const jwt = require('jsonwebtoken')
// TROOOOOOOLL
process.env.SECRET_KEY = 'secret'

router.post('/register', (req, res) => {
    const today = new Date()

    const uniqHash = crypto.randomBytes(20).toString('hex');

    const userData = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        created: today,
        genre: null,
        hash: uniqHash
    }
    if (req.body.firstname != "" && req.body.lastname != "" && req.body.email != "" && req.body.password != "") {
        connection.query('SELECT * FROM users WHERE username = ? OR email = ? ', [userData.username, userData.email], (err, rows) => {
            if (err) console.log(err)
            if (rows[0] && (rows[0]['email'] === userData.email)) {
                res.send({ error: 'Email existant, veuillez en choisir une autre !!' })
            }
            else if (rows[0] && rows[0]['username'] === userData.username) {
                res.send({ error: " Nom d'utilisateur existant, veuillez en choisir une autre" })
            }
            else if (rows[0] === [] || rows[0] === undefined) {
                if (userData.password.length < 6) {
                    res.send({ error: 'Mot de passe trop court, 6 min' })
                }
                else {
                    var hash = bcrypt.hashSync(userData.password, 12)
                    connection.query('INSERT INTO users SET username = ?, lastname = ?, firstname = ?, email = ?, password = ?, inscription_date = ?, hash= ?', [userData.username, userData.lastName, userData.firstName, userData.email, hash, userData.created, userData.hash], (err, result) => {
                        sendEmail('confirmUser', userData.email, uniqHash)
                        res.json({ status: userData.email + 'Registered!' })
                    })
                }
            }
        })
    }
    else {
        res.send({ error: 'Veuillez compléter tout les champs.' })
    }
})
////// LOGIN HANDLER /////////////////////////////////////////////////////////////////////////////////////
router.post('/login', (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password,
    }
    if (userData.username && userData.password) {
        connection.query('SELECT * FROM users WHERE username = ?', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                if (bcrypt.compareSync(userData.password, rows[0].password)) {
                    if (rows[0].valid === 0) {
                        res.send({ error: "Compte pas encore validé." })
                    }
                    else
                        connection.query('UPDATE users SET online = 1 WHERE username = ?', [req.body.username], (err, result) => {
                            if (rows[0].pic1 !== null) {
                                rows[0].pic1 = rows[0].pic1.toString('utf8')
                            }
                            if (rows[0].pic2 !== null) {
                                rows[0].pic2 = rows[0].pic2.toString('utf8')
                            }
                            if (rows[0].pic3 !== null) {
                                rows[0].pic3 = rows[0].pic3.toString('utf8')
                            }
                            let token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                expiresIn: 1440
                            })
                            res.send(token)
                        })
                }
                else {
                    res.send({ error: "Nom d'utilisateur ou mot de passe incorrecte." })
                }
            }
            else {
                res.send({ error: "Nom d'utilisateur ou mot de passe incorrecte." })
            }
        })
    }
    else {
        res.send({ error: 'Remplir tous les champs !' })
    }
})
////// LOGOUT HANDLER /////////////////////////////////////////////////////////////////
router.post('/logOut', (req, res) => {
    const today = new Date()
    let date = today.getDate() + "-" + parseInt(today.getMonth() + 01) + "-" + today.getFullYear();
    const userData = {
        email: req.body.email,
        connected: date,
    }

    connection.query('UPDATE users SET online = 0, connected = ? WHERE email = ?', [userData.connected, userData.email], (err, result) => {
        if (err) console.log(err)

        res.json({ status: userData.email + 'DECONECTED !' })
    })
})
////// PROFILE HANDLER /////////////////////////////////////////////////////////////////
router.post('/profile', (req, res) => {
    if (req.body) {
        const userData = {
            firstName: req.body.firstName,
            username: req.body.username,
            lastName: req.body.lastName,
            email: req.body.email,
            genre: req.body.genre,
            lookingFor: req.body.lookingFor,
            age: req.body.age,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
            bio: req.body.bio,
            interests: req.body.interests,
            pic1: req.body.pic1,
            pic2: req.body.pic2,
            pic3: req.body.pic3,
            lat: req.body.lat,
            lon: req.body.lon,
            adressUser: req.body.adressUser,
            file: req.body.file,
            error: req.body.error,
        }
        connection.query('UPDATE users SET completed = 1, firstname = ?, lastname = ?, email = ?, sexe = ?, orientation = ?, age = ?, city = ?, country = ?, bio = ?, pic1 = ?, pic2 = ?, pic3 = ?, interests = ?, lat = ?, lon = ? WHERE email = ?', [userData.firstName, userData.lastName, userData.email, userData.genre, userData.lookingFor, userData.age, userData.city, userData.city, userData.bio, userData.pic1, userData.pic2, userData.pic3, userData.interests, userData.lat, userData.lon, userData.email], (err) => {
            if (err) console.log(err)
            connection.query('SELECT * FROM users WHERE username = ?', [userData.username], (err, rows) => {
                if (rows[0].pic1 !== null) {
                    rows[0].pic1 = rows[0].pic1.toString('utf8')
                }
                if (rows[0].pic2 !== null) {
                    rows[0].pic2 = rows[0].pic2.toString('utf8')
                }
                if (rows[0].pic3 !== null) {
                    rows[0].pic3 = rows[0].pic3.toString('utf8')
                }
                let token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token)
            })
        })
    }
})

router.post('/UserList', (req, res) => {
    if (req.body) {
        const userData = {
            orientation: req.body.orientation,
            username: req.body.username,
            sexe: req.body.sexe,
            email: req.body.email,
            completed: 1,
            error: req.body.error,
        }
        let tmp = [];
        if (userData.orientation === "Bisexuelle") {
            if (userData.sexe === 'male') {
                connection.query('SELECT * FROM users WHERE sexe = "female" AND orientation != "female" AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows.length > 0) {
                        rows.forEach(function (value, key) {
                            connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                if (rows.length === 0) {
                                    if (value.pic1 !== null) {
                                        value.pic1 = value.pic1.toString('utf8')
                                        tmp.push(value)
                                    }
                                }
                            })
                        });
                    }
                    connection.query('SELECT * FROM users WHERE sexe = "male" AND (orientation != "female") AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                        if (err) console.log(err)
                        if (rows.length > 0) {
                            let count = rows.length;
                            rows.forEach(function (value, key) {
                                connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                    if (rows.length === 0) {
                                        if (value.pic1 !== null) {
                                            value.pic1 = value.pic1.toString('utf8')
                                            tmp.push(value)
                                        }
                                        if (key === count - 1) {
                                            res.send(tmp);
                                        }
                                    }
                                })
                            });
                        }
                        else {
                            res.send(tmp);
                        }
                    })
                })
            }
            else {
                connection.query('SELECT * FROM users WHERE sexe = "male" AND orientation != "male" AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows.length > 0) {
                        rows.forEach(function (value, key) {
                            connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                if (rows.length === 0) {
                                    if (value.pic1 !== null) {
                                        value.pic1 = value.pic1.toString('utf8')
                                        tmp.push(value)
                                    }
                                }
                            })
                        });
                    }
                    connection.query('SELECT * FROM users WHERE sexe = "female" AND orientation != "male" AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                        if (err) console.log(err)
                        if (rows.length > 0) {
                            let count = rows.length;
                            rows.forEach(function (value, key) {
                                connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                    if (rows.length === 0) {
                                        if (value.pic1 !== null) {
                                            value.pic1 = value.pic1.toString('utf8')
                                            tmp.push(value)
                                        }
                                        if (key === count - 1) {
                                            res.send(tmp);
                                        }
                                    }
                                })
                            });
                        }
                        else {
                            res.send(tmp);
                        }
                    })
                })
            }
        }
        else if (userData.orientation === userData.sexe) {
            connection.query('SELECT * FROM users WHERE sexe = ? AND (orientation = ? OR orientation = "Bisexuelle") AND email != ? AND completed = ?', [userData.orientation, userData.orientation, userData.email, userData.completed], (err, rows, result) => {
                let tmp = [];
                if (err) console.log(err)
                if (rows[0] !== [] || rows[0] !== undefined) {
                    let count = rows.length;
                    rows.forEach(function (value, key) {
                        connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                            if (rows.length === 0) {
                                if (value.pic1 !== null) {
                                    value.pic1 = value.pic1.toString('utf8')
                                    tmp.push(value)
                                }
                                if (key === count - 1) {
                                    res.send(tmp);
                                }
                            }
                        })
                    });
                }
                else {
                    res.send(tmp);
                }
            })
        }
        else {
            connection.query('SELECT * FROM users WHERE sexe = ? AND (orientation = ? OR orientation = "Bisexuelle") AND email != ? AND completed = ?', [userData.orientation, userData.sexe, userData.email, userData.completed], (err, rows, result) => {
                if (err) console.log(err)
                let tmp = []
                if (rows[0] !== [] || rows[0] !== undefined) {
                    let count = rows.length;
                    rows.forEach(function (value, key) {
                        connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                            if (rows.length === 0) {
                                if (value.pic1 !== null) {
                                    value.pic1 = value.pic1.toString('utf8')
                                    tmp.push(value)
                                }
                                if (key === count - 1) {
                                    res.send(tmp);
                                }
                            }
                        })
                    });
                }
                else {
                    res.send(tmp);
                }
            })
        }
    }
})

router.post('/UserListMatcher', (req, res) => {
    if (req.body) {
        const userData = {
            orientation: req.body.orientation,
            username: req.body.username,
            sexe: req.body.sexe,
            email: req.body.email,
            completed: 1,
            error: req.body.error,
        }
        let tmp = [];
        if (userData.orientation === "Bisexuelle") {
            if (userData.sexe === 'male') {
                connection.query('SELECT * FROM users WHERE sexe = "female" AND orientation != "female" AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows.length > 0) {
                        rows.forEach(function (value, key) {
                            connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                if (rows.length === 0) {
                                    connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, value.username], (err, rows, result) => {
                                        if (rows.length === 0) {
                                            if (value.pic1 !== null) {
                                                value.pic1 = value.pic1.toString('utf8')
                                                tmp.push(value)
                                            }
                                        }
                                    })
                                }
                            })
                        });
                    }
                    connection.query('SELECT * FROM users WHERE sexe = "male" AND (orientation != "female") AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                        if (err) console.log(err)
                        if (rows.length > 0) {
                            let count = rows.length;
                            rows.forEach(function (value, key) {
                                connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                    if (rows.length === 0) {
                                        connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, value.username], (err, rows, result) => {
                                            if (rows.length === 0) {
                                                if (value.pic1 !== null) {
                                                    value.pic1 = value.pic1.toString('utf8')
                                                    tmp.push(value)
                                                }
                                                if (key === count - 1) {
                                                    res.send(tmp);
                                                }
                                            }
                                        })
                                    }
                                })
                            });
                        }
                        else {
                            res.send(tmp);
                        }
                    })
                })
            }
            else {
                connection.query('SELECT * FROM users WHERE sexe = "male" AND orientation != "male" AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows.length > 0) {
                        rows.forEach(function (value, key) {
                            connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                if (rows.length === 0) {
                                    connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, value.username], (err, rows, result) => {
                                        if (rows.length === 0) {
                                            if (value.pic1 !== null) {
                                                value.pic1 = value.pic1.toString('utf8')
                                                tmp.push(value)
                                            }
                                        }
                                    })
                                }
                            })
                        });
                    }
                    connection.query('SELECT * FROM users WHERE sexe = "female" AND orientation != "male" AND email != ? AND completed = ?', [userData.email, userData.completed], (err, rows, result) => {
                        if (err) console.log(err)
                        if (rows.length > 0) {
                            let count = rows.length;
                            rows.forEach(function (value, key) {
                                connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                                    if (rows.length === 0) {
                                        connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, value.username], (err, rows, result) => {
                                            if (rows.length === 0) {
                                                if (value.pic1 !== null) {
                                                    value.pic1 = value.pic1.toString('utf8')
                                                    tmp.push(value)
                                                }
                                                if (key === count - 1) {
                                                    res.send(tmp);
                                                }
                                            }
                                        })
                                    }
                                })
                            });
                        }
                        else {
                            res.send(tmp);
                        }
                    })
                })
            }
        }
        else if (userData.orientation === userData.sexe) {
            connection.query('SELECT * FROM users WHERE sexe = ? AND (orientation = ? OR orientation = "Bisexuelle") AND email != ? AND completed = ?', [userData.orientation, userData.orientation, userData.email, userData.completed], (err, rows, result) => {
                let tmp = [];
                if (err) console.log(err)
                if (rows[0] !== [] || rows[0] !== undefined) {
                    let count = rows.length;
                    rows.forEach(function (value, key) {
                        connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                            if (rows.length === 0) {
                                connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, value.username], (err, rows, result) => {
                                    if (rows.length === 0) {
                                        if (value.pic1 !== null) {
                                            value.pic1 = value.pic1.toString('utf8')
                                            tmp.push(value)
                                        }
                                        if (key === count - 1) {
                                            res.send(tmp);
                                        }
                                    }
                                })
                            }
                        })
                    });
                }
                else {
                    res.send(tmp);
                }
            })
        }
        else {
            connection.query('SELECT * FROM users WHERE sexe = ? AND (orientation = ? OR orientation = "Bisexuelle") AND email != ? AND completed = ?', [userData.orientation, userData.sexe, userData.email, userData.completed], (err, rows, result) => {
                if (err) console.log(err)
                let tmp = []
                if (rows[0] !== [] || rows[0] !== undefined) {
                    let count = rows.length;
                    rows.forEach(function (value, key) {
                        connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, value.username], (err, rows, result) => {
                            if (rows.length === 0) {
                                connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, value.username], (err, rows, result) => {
                                    if (rows.length === 0) {
                                        if (value.pic1 !== null) {
                                            value.pic1 = value.pic1.toString('utf8')
                                            tmp.push(value)
                                        }
                                        if (key === count - 1) {
                                            res.send(tmp);
                                        }
                                    }
                                })
                            }
                        })
                    });
                }
                else {
                    res.send(tmp);
                }
            })
        }
    }
})

router.post('/UserSortList', (req, res) => {
    if (req.body) {
        const userData = {
            ageMax: req.body.ageMax,
            scorePop: req.body.scorePop,
            distanceKm: req.body.distanceKm,
            orientation: req.body.orientation,
            sexe: req.body.sexe,
            error: req.body.error,
        }
        connection.query('SELECT * FROM users WHERE sexe = ? AND orientation = ?', [userData.orientation, userData.sexe], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] || rows[0] !== undefined) {
                rows.forEach(function (value, key) {
                    if (value.pic1 !== null) {
                        value.pic1 = value.pic1.toString('utf8')
                    }
                });
                res.send(rows);
            }
            else {
                res.status(400).json({ error: 'Erreur : User does not exist' })
            }
        })
    }
})

router.post('/refreshUserDate/:name', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            liked: req.body.liked,
            error: req.body.error,
        }
        connection.query('SELECT * FROM users WHERE username = ? ', [userData.liked], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] || rows[0] !== undefined) {
                if (rows[0].pic1 !== null) {
                    rows[0].pic1 = rows[0].pic1.toString('utf8')
                }
                if (rows[0].pic2 !== null) {
                    rows[0].pic2 = rows[0].pic2.toString('utf8')
                }
                if (rows[0].pic3 !== null) {
                    rows[0].pic3 = rows[0].pic3.toString('utf8')
                }
                let tmp = rows[0];
                connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, userData.liked], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows[0] !== [] && rows[0] !== undefined) {
                        res.send({ blocked: rows[0] });
                    }
                    else {
                        res.send({});
                    }
                })
            }
        })
    }
})

router.post('/refreshUser/:name', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            liked: req.body.liked,
            error: req.body.error,
        }
        connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, userData.liked], (err, rows, result) => {
            if (err) console.log(err)
            if (rows.length > 0 || rows[0] !== undefined) {
                connection.query('SELECT * FROM likes WHERE username = ? and liked = ?', [userData.liked, userData.username], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows.length > 0) {
                        res.json({ status: 'likeYou', like: 'like' })
                    }
                    else {
                        res.json({ status: 'noLike', like: 'like' })
                    }
                });
            }
            else {
                connection.query('SELECT * FROM likes WHERE username = ? and liked = ?', [userData.liked, userData.username], (err, rows, result) => {
                    if (err) console.log(err)
                    if (rows.length > 0) {
                        res.json({ status: 'likeYou', like: 'noLike' })
                    }
                    else {
                        res.json({ status: 'noLike', like: 'noLike' })
                    }
                });
            }
        })
    }
})

router.post('/UserLiked', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        connection.query('SELECT * FROM users JOIN likes ON users.username = likes.username AND likes.liked = ?', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] || rows[0] !== undefined) {
                rows.forEach(function (value, key) {
                    if (value.pic1 !== null) {
                        value.pic1 = value.pic1.toString('utf8')
                    }
                });
                res.send(rows);
            }
        })
    }
})

router.post('/UserVisit', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        connection.query('SELECT * FROM users JOIN notif ON users.username = notif.sender AND notif.username = ? AND notif.notification = "visiter"', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] || rows[0] !== undefined) {
                rows.forEach(function (value, key) {
                    if (value.pic1 !== null) {
                        value.pic1 = value.pic1.toString('utf8')
                    }
                });
                res.send(rows);
            }
        })
    }
})

router.post('/UserMatchList', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        var matchList = [];
        connection.query('SELECT * FROM users JOIN likes ON users.username = likes.username AND likes.liked = ?', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] || rows[0] !== undefined) {
                let limit = rows.length;
                for (const user of rows) {
                    connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.username, user.username,], (err, rows, result) => {
                        limit--;
                        if (rows !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                            if (user.pic1 !== null) {
                                user.pic1 = user.pic1.toString('utf8')
                            }
                            matchList.push(user);
                        }
                        if (limit === 0) {
                            res.send(matchList)
                        }
                    })
                }
            }
        })
    }
})

router.post('/getNotifications', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        connection.query('SELECT * FROM notif WHERE username = ? ORDER BY date DESC ', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                connection.query('UPDATE notif SET readed = 1 WHERE username = ?', [userData.username], (err, result) => {
                })
                res.send(rows);
            }
        })
    }
})

router.post('/getNotificationsNav', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        connection.query('SELECT * FROM notif WHERE username = ? AND readed = 0', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                res.send(rows);
            }
            else {
                res.json({ status: userData.email + ' pas de notif' })
            }
        })
    }
})

router.post('/getUser', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        connection.query('SELECT * FROM users WHERE username = ?', [userData.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                if (rows[0].pic1 !== null) {
                    rows[0].pic1 = rows[0].pic1.toString('utf8')
                }
                if (rows[0].pic2 !== null) {
                    rows[0].pic2 = rows[0].pic2.toString('utf8')
                }
                if (rows[0].pic3 !== null) {
                    rows[0].pic3 = rows[0].pic3.toString('utf8')
                }
                res.send(rows);
            }
            else {
                res.json({ status: userData.email + ' pas de user' })
            }
        })
    }
})

router.post('/blockUser', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            blocked: req.body.blocked,
            error: req.body.error,
        }
        connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [userData.username, userData.blocked], (err, rows) => {
            if (err) console.log(err)
            if (rows && rows.length > 0) {
                connection.query('DELETE FROM block WHERE username = ? AND blocked = ?', [userData.username, userData.blocked], (err, result) => {
                    if (err) console.log(err)
                    res.json({ status: userData.blocked + ' is Deblocked' })
                })
            }
            else {
                connection.query('INSERT INTO block SET username = ?, blocked = ?', [userData.username, userData.blocked], (err, result) => {
                    if (err) console.log(err)
                    res.json({ status: userData.blocked + ' is blocked' })
                })
            }
        })
    }
})

router.post('/emailMdpHandler', (req, res) => {
    if (req.body) {

        const userData = {
            newEmail: req.body.newEmail,
            email: req.body.email,
            confirmEmail: req.body.confirmEmail,
            mdp: req.body.mdp,
            confirmMdp: req.body.confirmMdp,
            errors: {},
            username: req.body.username
        }
        if (userData) {
            if (userData.newEmail !== '' && (userData.newEmail === userData.confirmEmail)) {
                connection.query('UPDATE users SET email = ? WHERE email = ?', [userData.newEmail, userData.email], (err, results) => {
                    if (err) console.log(err)
                })
            }
            else if (userData.mdp !== '' && (userData.mdp === userData.confirmMdp)) {
                var hash = bcrypt.hashSync(userData.confirmMdp, 12)
                connection.query('UPDATE users SET password = ? WHERE email = ?', [hash, userData.email], (err, results) => {
                    if (err) console.log(err)
                })
            }
            connection.query('SELECT * FROM users WHERE username= ?', [userData.username], (err, rows) => {
                if (rows[0].pic1 !== null) {
                    rows[0].pic1 = rows[0].pic1.toString('utf8')
                }
                if (rows[0].pic2 !== null) {
                    rows[0].pic2 = rows[0].pic2.toString('utf8')
                }
                if (rows[0].pic3 !== null) {
                    rows[0].pic3 = rows[0].pic3.toString('utf8')
                }
                let token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token)
            })
        }
        else {
            res.send({ error: "no data" });

        }
    }
})

router.get('/confirm/:hash', (req, res) => {
    const valid = true
    connection.query('UPDATE users set valid = ? WHERE hash = ?', [valid, req.params.hash], (err, result) => {
        if (result)
            return res.redirect('http://localhost:3000/validated');
        else
            return res.status(400).send({ error: "Une erreur est survenue, reesayez" })
    })
})

router.post('/emailresetsent', (req, res) => {
    const userData = {
        email: req.body.email,
    }
    if (req.body.email) {
        connection.query('SELECT * FROM users WHERE email = ?', [userData.email], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                sendEmail(req.body.type, req.body.email, rows[0].hash)
                return res.status(200).send({ message: "email envoyé" });
            }
            else {
                res.send({ error: "L'adresse mail n'existe pas ou réessayez." })
            }
        })
    }
})

router.get('/redirectPassword/:hash', (req, res) => {
    if (req.params.hash) {
        connection.query('SELECT * FROM users WHERE hash = ?', [req.params.hash], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                return res.redirect('http://localhost:3000/resetPassword/' + req.params.hash);
            }
            else {
                return res.redirect('http://localhost:3000/login');
            }
        })
    }
})

router.post('/resetpassword/:hash', (req, res) => {
    if (req.body) {
        if (!req.body.password1 || !req.body.password2 || !req.body.email) {
            res.send({ error: "Un ou plusieurs champs ne sont pas remplis." });
        }
        else {
            const userData = {
                password: req.body.password1,
                confirmpassword: req.body.password2,
                email: req.body.email,
                hash: req.params.hash
            }
            connection.query('SELECT * from users WHERE hash = ? ', [userData.hash], (err, rows, results) => {
                if (err) console.log(err)
                if (rows[0] !== [] && rows[0] !== undefined && rows !== undefined && rows.length > 0) {
                    if (userData.password !== '' && (userData.password === userData.confirmpassword)) {
                        var hash = bcrypt.hashSync(userData.confirmpassword, 12)
                        connection.query('UPDATE users SET password = ? WHERE email = ?', [hash, userData.email], (err, results) => {
                            if (err) console.log(err)
                            res.send({ message: "ok" });
                        })
                    }
                    else {
                        res.send({ error: "Les mots de passes ne sont pas identiques" });
                    }
                }
                else {
                    res.send({ error: "Les informations ne sont pas correctes." });
                }
            })
        }
    }
    else {
        res.send({ error: "no data" });
    }
})

router.post('/reportUser', (req, res) => {

    const userData = {
        username: req.body.username,
        email: req.body.email || "",
        blocked: req.body.blocked,
        blockedEmail: req.body.blockedEmail || "",
    }
    if (req.body.username && req.body.blocked) {
        sendEmailReport(userData)
        return res.status(200).send({ message: "Le signalement à bien été effectué." });
    }
    else {
        res.send({ message: "Une erreur s'est produite." })
    }
})

router.post('/blockedList', (req, res) => {
    if (req.body) {
        const userData = {
            username: req.body.username,
            error: req.body.error,
        }
        let tmp = [];
        connection.query('SELECT * FROM users JOIN block ON users.username = block.blocked AND block.username = ?', [userData.username], (err, rows) => {
            if (err) console.log(err)
            if (rows.length > 0) {
                rows.forEach(function (value, key) {
                    if (value.pic1 !== null) {
                        value.pic1 = value.pic1.toString('utf8')
                    }
                    tmp.push(value);
                });
                res.send(tmp)
            }
            else {
                res.send({})
            }
        })
    }

})

module.exports = router