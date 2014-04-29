Super Pagination
================

Super Pagination for Node.js, Mongoose and Twitter Bootstrap.

### Installation

    npm install super-pagination

### API

#### Mongoose

Extend the mongoose model to run a pagination query.

- @params : #Object
        defaults: {
            per_page : 10,
            page : 1,
            url : '/',
            query : {},
            select : null,
            populate : null,
            sort : null
        }
- @callback : #Function
        function(err, results, pagination){
            ...
        }

    mongoose.paginate([params], [callback]);


##### Usage

    var mongoose = require('super-pagination').mongoose,
        Model = mongoose.model('Model');

    Model.paginate({
        query : {
        },
        page : req.query.page || 1,
        select : 'name summary created',
        populate : 'user',
        sort : {
            'created' : -1
        },
        url : '/'
    }, function(err, results, pagination){
        if (err) return console.log('Error', err);

        res.render(config.public_theme + '/list', {
            results : results,
            links : pagination.render()
        });
    });

#### Paginator

#### set( );

Set the configuration for the pagination

- @params : #Object
        defaults: {
            total : 1000,
            per_page : 10,
            current_page : 2,
            url : '/',
            params : {

            },
            page_param : 'page',
            show_next : true,
            show_prev : true,
            next_text : '&raquo;',
            prev_text : '&laquo;',
            size : null,
            number_pages : 5
        }


    paginator.set([params]);

##### Usage
    var pagination = new paginator().set({
        per_page : 10,
        current_page : 1,
        total : 1000,
        number_pages : Math.ceil(1000 / 10),
        url : '/'
    });

### render( );
Returns HTML in bootstrap format

    paginator.render();

##### Usage
    var html = pagination.render();

### json( );

Returns JSON for building custom pagination.

    paginator.json();

##### Usage
    var json = pagination.json();  
