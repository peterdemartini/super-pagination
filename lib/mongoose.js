'use strict';

var mongoose = require('mongoose'),
    paginator = require('./paginator'),
    _ = require('lodash');

mongoose.Model.paginate = function (settings, callback) {
    var defaults = {
            per_page : 10,
            page : 1,
            url : '/',
            query : {},
            select : null,
            populate : null,
            sort : null
        },
        model = this;

    settings = _.extend(defaults, settings);

    model.count(settings.query, function (err, total) {
        var query = model.find(settings.query)
        .skip((settings.page - 1) * settings.per_page)
        .limit(settings.per_page);
        if(settings.select){
            query.select(settings.select);
        }
        if(settings.sort){
            query.sort(settings.sort);
        }
        if(settings.populate){
            query.populate(settings.populate);
        }
        query.exec(function (error, records) {
            if (err) return callback(err);
            var pagination = new paginator().set({
                per_page : settings.per_page,
                current_page : settings.page,
                total : total,
                number_of_pages : Math.ceil(total / settings.per_page),
                url : settings.url
            });
            callback(null, records, pagination);
        });
    });
};

module.exports = mongoose;
