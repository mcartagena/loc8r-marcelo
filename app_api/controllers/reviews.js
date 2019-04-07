var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {    
    res.status(status);                                      
    res.json(content);                                       
};

module.exports.reviewsCreate = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.reviewsReadOne = function (req, res) {
    console.log('Finding reviews in details', req.params);
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc.findById(req.params.locationid)
        .select('name reviews')
        .exec(function(err, location) {
            var response, review;
            if(!location){
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if(err){
                console.log(err);
                sendJsonResponse(res, 404, err);        
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                console.log('Reviewid: ',req.params.reviewid);
                console.log('Reviews: ', location.reviews.length);
                console.log('Reviews: ', location.reviews);
                review = location.reviews.id(req.params.reviewid);  
                if (!review) {                            
                  sendJsonResponse(res, 404, {            
                    "message": "reviewid not found"       
                  });                                     
                } else {                                   
                  response = {                             
                    location : {                           
                      name : location.name,                
                      id : req.params.locationid           
                    },                                     
                    review : review                        
                  };                                       
                  console.log(response);
                  sendJsonResponse(res, 200, response);    
                } 
            } else {                                 
                sendJsonResponse(res, 404, {           
                  "message": "No reviews found"        
                });                                    
            } 
        });
    } else {
        console.log('No locationid specified');
        sendJsonResponse(res, 404, {                  
            "message": "Not found, locationid and reviewid are both required"       
        });      
    }
};

module.exports.reviewsUpdateOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.reviewsDeleteOne = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};
