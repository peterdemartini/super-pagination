'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    Schema = mongoose.Schema,
    superPagination = require('../lib/mongoose');

var title = 'Hello', limit = 50;

describe('Book', function () {

    var Book, Type;

    before(function (done) {
        async.waterfall([

            function (next) {
                mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/pagination_test');
                next();
            },
            function (next) {
                var BookSchema = new Schema({
                    title: String,
                    type: {
                        type: Schema.Types.ObjectId,
                        ref: 'Type'
                    },
                    created: {
                        type: Date,
                        default: Date.now
                    }
                });

                BookSchema.plugin(superPagination, {
                    theme : 'bootstrap'
                });

                mongoose.model('Book', BookSchema);

                var TypeSchema = new Schema({
                    name: String
                });

                mongoose.model('Type', TypeSchema);

                Book = mongoose.model('Book');

                Type = mongoose.model('Type');

                next(null);
            },
            function (next) {
                var name = 'Awesome';
                Type.findOne({
                        name: name
                    },
                    function (err, type) {
                        if (err) throw err;
                        if (type && type.length) next(null, Book, Type, type);

                        var newType = new Type({
                            name: name
                        });
                        newType.save(function (err, type) {
                            if (err) return next(err);
                            next(null, type);
                        });
                    });

            },
            function (type, next) {

                Book.count({
                        title: title
                    },
                    function (err, count) {
                        if (err) throw err;
                        async.whilst(
                            function () {
                                return count < limit;
                            },
                            function (callback) {
                                count++;
                                var book = new Book({
                                    title: title,
                                    type: type
                                });
                                book.save(callback);
                            },
                            function (err) {
                                if (err) throw err;

                                next(null);
                            }
                        );
                    });
            }
        ], function (err) {
            if (err) throw err;

            done();
        });
    });

    describe('#find()', function () {
        it('should save without error', function (done) {
            Type.find({}, done);
        });
    });

    describe('#paginate()', function () {

        it('should return results and pagination at start', function (done) {
            Book.paginate({
                query: {
                    title: title
                },
                page: 1,
                select: 'title',
                populate: 'type',
                sort: {
                    'created': -1
                },
                per_page: 5,
                url: '/'
            }, function (err, results, pagination) {
                if (err) throw err;

                var json = pagination.json();
                if (!json) {
                    throw Error('No pagination');
                }
                if (json.total !== limit) {
                    throw Error('Incorrect pagination results');
                }
                var pages = json.pages.length;
                if (pages !== json.number_of_links) {
                    throw Error('Incorrect number of links. Expecting ' +
                        json.number_of_links + ', got ' +
                        pages);
                }
                done();
            });
        });

        it('should return results and pagination at end', function (done) {
            Book.paginate({
                query: {
                    title: title
                },
                page: 10,
                select: 'title',
                populate: 'type',
                sort: {
                    'created': -1
                },
                per_page: 5,
                url: '/'
            }, function (err, results, pagination) {
                if (err) throw err;

                var json = pagination.json();
                if (!json) {
                    throw Error('No pagination');
                }
                if (json.total !== limit) {
                    throw Error('Incorrect pagination results');
                }
                var pages = json.pages.length;
                if (pages !== json.number_of_links) {
                    throw Error('Incorrect number of links. Expecting ' +
                        json.number_of_links + ', got ' +
                        pages);
                }
                done();
            });
        });

        it('should return results and pagination in middle', function (done) {
            Book.paginate({
                query: {
                    title: title
                },
                page: 7,
                select: 'title',
                populate: 'type',
                sort: {
                    'created': -1
                },
                per_page: 5,
                url: '/'
            }, function (err, results, pagination) {
                if (err) throw err;

                var json = pagination.json();
                if (!json) {
                    throw Error('No pagination');
                }
                if (json.total !== limit) {
                    throw Error('Incorrect pagination results');
                }
                var pages = json.pages.length;
                if (pages !== json.number_of_links) {
                    throw Error('Incorrect number of links. Expecting ' +
                        json.number_of_links + ', got ' +
                        pages);
                }

                done();
            });
        });

        it('should return results and custom pagination', function (done) {
            Book.paginate({
                query: {
                    title: title
                },
                page: 1,
                select: 'title',
                populate: 'type',
                sort: {
                    'created': -1
                },
                per_page: 5,
                url: '/',
                theme : 'custom',
                number_of_links : 3,
                custom_template : '<div>{{ data.next_url }}</div>'
            }, function (err, results, pagination) {
                if (err) throw err;

                var json = pagination.json();
                if (!json) {
                    throw Error('No pagination');
                }
                if (json.total !== limit) {
                    throw Error('Incorrect pagination results');
                }
                var pages = json.pages.length;
                if (pages !== json.number_of_links) {
                    throw Error('Incorrect number of links. Expecting ' +
                        json.number_of_links + ', got ' +
                        pages);
                }
                done();
            });
        });

        it('should return no results and pagination', function (done) {
            Book.paginate({
                query: {
                    name: 'Bacon'
                }
            }, function (err, results, pagination) {
                if (err) throw err;
                if (results.length) {
                    throw Error('Should return no results');
                }

                if (!pagination) {
                    throw Error('No pagination');
                }
                var html = pagination.render();
                if(html !== '<div></div>'){
                    throw Error('Should return empty string');
                }

                done();
            });
        });

    });

});
