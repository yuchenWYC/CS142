/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require("fs");

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

var express = require('express');
var app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            { name: 'user', collection: User },
            { name: 'photo', collection: Photo },
            { name: 'schemaInfo', collection: SchemaInfo }
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    // find data requested in database
    let query = User.find({});
    query.select("first_name last_name login_name").exec((err, users) => {
        // data not found or other errors
        if (err) {
            console.log("error", err);
            response.status(500).send(JSON.stringify(err));
        } else {
            // data successfully found
            console.log("Success accessing /user/list");
            // send response
            response.status(200).send(users);
        }
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    let id = request.params.id;
    if (!mongoose.isValidObjectId(id)) {
        response.status(400).send("invalid ID");
        return;
    }
    User.findOne({ '_id': id }, '-__v -password', (err, user) => {
        if (err) {
            console.log("error", err);
            response.status(400).send(JSON.stringify(err));
        } else if (!user || user.length <= 0) {
            console.log('user id ' + id + ' not found');
            response.status(400).send('user id' + id + 'not found');
        } else {
            console.log("Success accessing /user/" + id);
            response.status(200).send(user);
        }
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    let id = request.params.id;
    if (!mongoose.isValidObjectId(id)) {
        console.log("invalid ID");
        response.status(400).send("invalid ID");
        return;
    }
    Photo.find({ 'user_id': id }, "-__v", (err, photos) => {
        if (err) {
            console.log("error", err);
            response.status(400).send(JSON.stringify(err));
        } else if (photos.length <= 0) {
            console.log('This user has no photo');
            response.status(200).send([]);
        } else {
            console.log("Success accessing /photosOfUser/" + id);
            // make a copy of photos so adding user to photo.comment won't vialate mongoose schema
            photos = JSON.parse(JSON.stringify(photos));
            async.each(photos, function (photo, callback) {
                async.each(photo.comments, function (comment, callback) {
                    console.log("Success accessing photo comments");
                    User.findOne({ '_id': comment.user_id }, 'first_name last_name', (err, user) => {
                        if (err) {
                            console.log("error", err);
                            response.status(400).send(JSON.stringify(err));
                            callback(err);
                        } else if (!user || user.length <= 0) {
                            response.status(400).send('user id' + comment.user_id + 'not found');
                            callback('user id ' + comment.user_id + ' not found');
                        } else {
                            comment.user = user;
                            delete comment.user_id;
                            callback();
                        }
                    });
                }, function (err) { // callback for comments
                    if (err) {
                        console.log("/photosOfUser/:id", err);
                        response.status(500).send(JSON.stringify(err));
                    } else {
                        callback();
                    }
                })
            }, function (err) { // main callback
                if (err) {
                    console.log("/photosOfUser/:id", err);
                    response.status(500).send(JSON.stringify(err));
                } else {
                    response.status(200).send(photos);
                }
            });
        }
    })
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});

/*
 * URL /admin/login - Provides a way for the photo app's LoginRegister view to login in a user. 
 * The POST request JSON-encoded body should include a property login_name (no passwords for now) 
 * and reply with information needed by your app for logged in user. An HTTP status of 400 
 * (Bad request) should be returned if the login failed (e.g. login_name is not a valid account). 
 * A parameter in the request body is accessed using request.body.parameter_name. Note the login 
 * register handler should ensure that there exists a user with the given login_name. If so, it 
 * stores some information in the Express session where it can be checked by other request 
 * handlers that need to know whether a user is logged in.
 */
app.post('/admin/login', function (request, response) {
    const login_name = request.body.login_name;
    User.findOne({ 'login_name': login_name }, (err, user) => {
        if (err) {
            console.log("error", err);
            response.status(400).send(err);
        } else if (!user || user.length <= 0) {
            console.log('/admin/login', 'user ' + login_name + ' not found');
            response.status(400).send('user ' + login_name + ' not found');
        } else if (user.password !== request.body.password) {
            console.log('password incorrect');
            response.status(400).send('password incorrect');
        }
        else {
            console.log("Success accessing /user/" + login_name);
            request.session.login_name = login_name;
            request.session._id = user._id;
            request.session.first_name = user.first_name;
            response.status(200).send(request.session);
        }
    });

});

/*
 * URL /admin/logout - A POST request with an empty body to this URL will logout the user by 
 * clearing the information stored in the session. An HTTP status of 400 (Bad request) should 
 * be returned in the user is not currently logged in.
 */
app.post('/admin/logout', function (request, response) {
    if (!(request.session.login_name)) {
        console.log('user is not currently logged in');
        response.status(400).send('user is not currently logged in');
    } else {
        delete request.session.login_name;
        delete request.session.user_id;
        request.session.destroy(function (err) {
            if (err) console.log("/admin/logout error", err);
        });
        response.status(200).send("Success!");
    }
});

/**
 * URL /commentsOfPhoto/:photo_id - Add a comment to the photo whose id is photo_id. 
 * The body of the POST requests should be a JSON-encoded body with a single 
 * property comment that contains the comment's text. The comment object created on 
 * the photo must include the identifier of the logged in user and the time when 
 * the comment was created. Your implementation should reject any empty comments 
 * with a status of 400 (Bad request).
 */
app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
    }
    else if (request.body.comment.length <= 0) {
        console.log('empty comment');
        response.status(400).send('empty comment');
    } else {
        let photo_id = request.params.photo_id;
        let mentions = request.body.mentions;
        Photo.findOne({ _id: photo_id }, (err, photo) => {
            if (err) {
                console.log("/commentsOfPhoto/:photo_id error", err);
                response.status(400).send(JSON.stringify(err));
            } else if (!photo) {
                console.log('/commentsOfPhoto/:photo_id', photo_id + " not found");
                response.status(400).send('/commentsOfPhoto/:photo_id ' + photo_id + " not found");
            } else {
                photo.mentions = [...new Set([...photo.mentions, ...mentions])];
                const new_comment = {
                    user_id: request.session._id,
                    comment: request.body.comment,
                }
                photo.comments.push(new_comment);
                photo.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                response.status(200).end()
            }
        })
    }
});

const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');

app.post('/photos/new', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            // XXX -  Insert error handling code here.
            console.log('/photos/new process Form Body', err);
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes

        // XXX - Do some validation here.
        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        const timestamp = new Date().valueOf();
        const filename = 'U' + String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            // XXX - Once you have the file written into your images directory under the name
            // filename you can create the Photo object in the database
            if (err) {
                console.log(err);
                return;
            } else {
                const new_photo = new Photo({
                    file_name: filename,
                    date_time: timestamp,
                    user_id: request.session.user_id,
                    comments: undefined
                });
                new_photo.save((err) => { console.log(err); });
                console.log("The request was successful!");
                response.status(200).send("The request was successful!");
            }
        });
    });
});

/**
 * URL /user - to allow a user to register. The registration POST takes a 
 * JSON-encoded body with the following properties: (login_name, password, 
 * first_name, last_name, location, description, occupation). The post 
 * request handler must make sure that the new login_name is specified and 
 * doesn't already exist. The first_name, last_name, and password must be 
 * non-empty strings as well. If the information is valid, then a new user 
 * is created in the database. If there is an error, the response should 
 * return status 400 and a string indicating the error.
 */
app.post('/user', function (request, response) {
    function zeroLen(field) {
        return field.length <= 0;
    }
    if (zeroLen(request.body.login_name) || zeroLen(request.body.first_name) ||
        zeroLen(request.body.last_name) || zeroLen(request.body.password)) {
        console.log("You must fill in all the required fields.");
        response.status(400).send("You must fill in all the required fields.");
    } else {
        User.countDocuments({ login_name: request.body.login_name }, function (err, count) {
            if (err) {
                console.log(err);
                response.status(400).send(err);
            } else if (count > 0) {
                console.log("The login_name already exists");
                response.status(400).send("The login name already exists.");
            } else {
                // the user is valid, create a new object in database
                User.create({
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    location: request.body.location,
                    description: request.body.description,
                    occupation: request.body.description,
                    login_name: request.body.login_name,
                    password: request.body.password,
                }, (err) => { console.log(err); })
                response.status(200).end();
            }
        });
    }
});

app.get("/mentionedByPhotos/:id", function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }

    let user_id = request.params.id;
    User.findOne({ '_id': user_id }, (err, user) => {
        if (err) {
            console.log("error", err);
            response.status(400).send(JSON.stringify(err));
        } else if (!user || user.length <= 0) {
            console.log('/mentionedByPhotos/:id id ' + user_id + ' not found');
            response.status(400).send('/mentionedByPhotos/:id id ' + user_id + ' not found');
        } else {
            let login_name = user.login_name;
            Photo.find({ mentions: login_name }, function (err, photos) {
                if (err) {
                    console.log("error", err);
                    response.status(400).send(JSON.stringify(err));
                } else if (photos.length <= 0) {
                    console.log('/mentionedByPhotos/:id ' + login_name + ' has no mentions');
                    response.status(200).send([]);
                } else {
                    let mentionDetail = []
                    function findUser(photo, callback) {
                        console.log(photo._id);
                        User.findOne({ '_id': photo.user_id }, (err, user) => {
                            if (err) {
                                console.log("error", err);
                                response.status(400).send(JSON.stringify(err));
                                callback(err);
                            } else if (!user || user.length <= 0) {
                                console.log('/mentionedByPhotos/:id id ' + photo.user_id + ' not found');
                                response.status(400).send('/mentionedByPhotos/:id id ' + photo.user_id + ' not found');
                                callback();
                            } else {
                                mentionDetail.push(
                                    {
                                        file_name: photo.file_name,
                                        photo_id: photo._id,
                                        user_id: photo.user_id,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                    });
                                callback();
                            }
                        });
                    }
                    async.each(photos, findUser, function (err) {
                        if (err) console.log(err);
                        response.status(200).send(mentionDetail);
                    });
                }
            });
        }
    });
});


// Add a photo to a user's favorite list
app.post("/favorite/add", function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    var user_id = request.body.user_id;
    var photo_id = request.body.photo_id;

    User.findOne({ "_id": user_id }, function (err, user) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (!user) {
            response.status(400).send('/favorite/add id ' + user_id + ' not found');
            return;
        }
        console.log("AAAAAA before", user.favorites);
        if (!user.favorites.includes(photo_id)) {
            user.favorites.push(photo_id);
            user.save(function (err) {
                if (err) console.error(err);
            });
            console.log("/favorite/add success", user._id, user.favorites);
        }
        response.status(200).end();
    });
});


app.post("/favorite/remove", function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    var user_id = request.body.user_id;
    var photo_id = request.body.photo_id;

    User.findOne({ "_id": user_id }, function (err, user) {
        if (err) {
            response.status(500).send(err);
            return;
        }
        if (!user) {
            response.status(400).send("Could not find user with id: " + user_id);
            return;
        }
        if (user.favorites.includes(photo_id)) {
            user.favorites = user.favorites.filter(function (item) {
                return item !== photo_id
            });
        }
        user.save(function (err) {
            if (err) console.error(err);
        });
        console.log("/favorite/remove success", user._id, user.favorites);
        response.status(200).end();
    });
});


app.post("/photos", function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send("not logged in");
        return;
    }
    Photo.find({ "_id": request.body.photo_ids }, function (err, photos) {
        if (err) {
            console.log("/photos error");
            response.status(500).send(JSON.stringify(err));
            return;
        } else if (!photos) {
            console.log("Could not find photo with given ID", request.body.photo_ids);
            response.status(400).send("Could not find photo with given ID");
            return;
        } else {
            console.log("/photos success");
            response.status(200).send(photos);
        }
    });
});
