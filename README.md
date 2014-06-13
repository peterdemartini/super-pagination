Super Pagination
================

[![Dependency Status](https://david-dm.org/peterdemartini/super-pagination.svg?theme=shields.io)](https://david-dm.org/peterdemartini/super-pagination)
[![devDependency Status](https://david-dm.org/peterdemartini/super-pagination/dev-status.svg?theme=shields.io)](https://david-dm.org/peterdemartini/super-pagination#info=devDependencies)

Super Pagination for Node.js, Mongoose and Twitter Bootstrap. There two objects built into this module, one for paginating mongoose and one for creating pagination. When using the mongoose paginate function you are returned with results and the pagination object.

**UPDATE:** The mongoose object is now following the current mongoose plugin schema.

## Installation

    npm install super-pagination

## API

## Mongoose

### paginate( ) `[type = 'function']`

A mongoose plugin to run a pagination query.

**@params** :

type: `Object`

````
defaults: {
    per_page : 10,
    page : 1,
    url : '/',
    query : {},
    select : null,
    populate : null,
    sort : null
}
````

**@callback** :

    type: `Function`

````
function(err, results, pagination){
    ...
}
````

````
mongoose.paginate([params], [callback]);
````

### Usage

Model:


    // book.js
    var superPagination = require('super-pagination').mongoose;

    var Book = new Schema({ ... });

    Book.plugin(superPagination, defaults);


Controller:


    var mongoose = require('mongoose'),
        Book = mongoose.model('Book');

    Book.paginate({
        query : {
        },
        page : req.query.page || 1,
        select : 'title summary created',
        populate : 'user',
        sort : {
            'created' : -1
        },
        url : '/'
    }, function(err, results, pagination){
        if (err) return console.log('Error', err);

        res.render('index', {
            results : results,
            pagination : pagination.render()
        });
    });

View:

    <html>
        <head>
            <title>Superpagination</title>
            <!-- Include Bootstrap files -->
        </head>
        <body>
            <h1>Results</h1>
            <div id="results" class="row">
                ...
            </div>
            {{ pagination }}
        </body>
    </html>


## Paginator

### set( ) `[type = 'function']`

Set the configuration for the pagination

**@params**:

type: `Object`

````
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
    number_of_pages : 1,
    number_of_links : 5,
    show_empty : true
}
````

````
paginator.set([params]);
````

### Usage

    var paginator = require('super-pagination').paginator;

    var pagination = new paginator().set({
        per_page : 10,
        current_page : 1,
        total : 1000,
        number_pages : Math.ceil(1000 / 10),
        url : '/'
    });

### render( ) `[type = 'function']`
Returns HTML in bootstrap format

    paginator.render();

### Usage
    var html = pagination.render();

### json( ) `[type = 'function']`

Returns JSON for building custom pagination.

    paginator.json();

### Usage
    var json = pagination.json();  
