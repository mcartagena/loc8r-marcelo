var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var theEarth = (function () {
    var earthRadius = 6371; // km, miles is 3959

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    var getDistanceFromMeters = function (meters) {
        return parseFloat(meters / 1000);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance,
        getDistanceFromMeters: getDistanceFromMeters
    };
})();


module.exports.locationsCreate = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    if (!lng || !lat) {
        sendJsonResponse(res, 400, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }

    Loc.aggregate(
        [{
            $geoNear: {
                'near': point,
                'spherical': true,
                'maxdistance': theEarth.getRadsFromDistance(20),
                'num': 10,
                'distanceField': 'dis'
            }
        }
        ], function (err, results) {
            var locations = [];
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                console.log(results);
                results.forEach(function (doc) {
                    locations.push({
                        distance: theEarth.getDistanceFromMeters(doc.dis),
                        name: doc.name,
                        address: doc.address,
                        facilities: doc.facilities,
                        rating: doc.rating,
                        _id: doc._id
                    });
                });
                sendJsonResponse(res, 200, locations);
            }
        });

};

module.exports.locationsReadOne = function (req, res) {
    console.log('Finding location details', req.params);
    if (req.params && req.params.locationid) {
        Loc.findById(req.params.locationid).exec(function (err, location) {
            if (!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJsonResponse(res, 404, err);
                return;
            }
            console.log(location);
            sendJsonResponse(res, 200, location);
        });
    } else {
        console.log('No locationid specified');
        sendJsonResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsUpdateOne = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.locationsDeleteOne = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};
