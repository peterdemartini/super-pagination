var mongoose = require('mongoose'),
    paginator = require('./paginator'),
    _ = require('lodash');

mongoose.Model.paginate = function (settings, callback) {
    var defaults = {
            limit : 10,
            page : 1,
            query : {},
            select : null,
            populate : null
        },
        model = this;

    settings = _.extend(defaults, settings);

    model.count(settings.query, function (err, total) {
        var query = model.find(settings.query)
        .skip((settings.page - 1) * settings.limit)
        .limit(settings.limit);

        query.exec(function (error, records) {
            if (err) return callback(err);
            var paginator = new Paginator({
                
            });
            callback(null, records, paginator);
        });
    });
};

module.exports = mongoose;
