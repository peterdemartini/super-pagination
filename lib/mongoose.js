'use strict';

var paginator = require('./paginator'),
    _ = require('lodash');

module.exports = function (schema, options) {

    var defaults = {
        per_page: 10,
        page: 1,
        url: '/',
        query: {},
        select: null,
        populate: null,
        sort: null
    };

    defaults = _.extend(defaults, options);

    schema.statics.paginate = function (settings, callback) {

        var model = this;

        settings = _.extend(defaults, settings);

        model.count(settings.query, function (err, total) {
            var query = model.find(settings.query)
                .skip((settings.page - 1) * settings.per_page)
                .limit(settings.per_page);

            if (settings.select) {
                query.select(settings.select);
            }
            if (settings.sort) {
                query.sort(settings.sort);
            }
            if (settings.populate) {
                query.populate(settings.populate);
            }
            query.exec(function (error, records) {
                if (err) return callback(err);
                var paginationSetting = _.extend(
                        settings,
                        {
                            per_page: settings.per_page,
                            current_page: settings.page,
                            total: total,
                            number_of_pages: Math.ceil(total / settings.per_page),
                        }
                    );
                var pagination = new paginator().set(paginationSetting);
                callback(null, records, pagination);
            });
        });
    };
};
