Super Pagination
================

[![Build Status](https://travis-ci.org/peterdemartini/super-pagination.svg?branch=master)](https://travis-ci.org/peterdemartini/super-pagination)
[![Dependency Status](https://david-dm.org/peterdemartini/super-pagination.svg?theme=shields.io)](https://david-dm.org/peterdemartini/super-pagination)
[![devDependency Status](https://david-dm.org/peterdemartini/super-pagination/dev-status.svg?theme=shields.io)](https://david-dm.org/peterdemartini/super-pagination#info=devDependencies)

Super Pagination is an all-in-one solution for Node.js, Mongoose and Twitter Bootstrap. There two objects built into this module, one for paginating mongoose and one for creating pagination (HTML or JSON). When using the mongoose paginate function you are returned with results and the pagination object.

**UPDATE:** The mongoose object is now following the current mongoose plugin schema.

## Installation

    npm install super-pagination

## API

## Mongoose

Add the Super Pagination Mongoose Plugin to your Model. The second parameter allows you set any of the configuration for your pagination - which can be overwritten when you call paginate().

    var superPagination = require('super-pagination').mongoose;

    MongooseSchema.plugin(superPagination, defaults);

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
    sort : null,
    custom_template : null,
    theme : 'bootstrap'
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
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        superPagination = require('super-pagination').mongoose;

    var BookSchema = new Schema({ ... });

    BookSchema.plugin(superPagination, {
        theme : 'bootstrap'
    });

    mongoose.model('Book', BookSchema);

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
        per_page : 5,
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
            <title>Super Pagination</title>
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
    current_page : 1,
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
    show_empty : true,
    custom_template : null,
    theme : 'bootstrap' // ['bootstrap', 'html', 'custom']
}
````

````
paginator.set([params]);
````

### Usage

Bootstrap / HTML:

    var paginator = require('super-pagination').paginator;

    var pagination = new paginator().set({
        per_page : 10,
        current_page : 1,
        total : 1000,
        number_of_pages : ,
        url : '/',
        theme : 'bootstrap'
    });

Custom Template:

    var paginator = require('super-pagination').paginator;

    var pagination = new paginator().set({
        per_page : 10,
        current_page : 1,
        total : 1000,
        number_of_pages : ,
        url : '/',
        theme : 'custom',
        custom_template : '<div class="pagination {% if data.size %}pagination-{{ data.size }}{% endif %}">
            {% if data.show_next %}
                <a href="{{ data.prev_url }}" title="Previous Page" class="prev-page">{{ data.prev_text }}</a>
            {% endif %}
            {% for page in data.pages %}
                <a href="{{ page.url }}" title="Go to Page ({{ page.number }})" class="page {% if page.class %}{{ page.class }}{% endif %}">{{ page.number }}</a>
            {% endfor %}
            {% if data.show_next %}
                <a href="{{ data.next_url }}" title="Next Page" class="prev-page">{{ data.next_text }}</a>
            {% endif %}
        </div>',
    });

### render( ) `[type = 'function']`
Returns HTML in bootstrap format. If there are no other pages it will return an empty string.

    paginator.render();

### Usage
    var html = pagination.render();

Bootstrap:

    Returns => <ul class="pagination ">

        <li>
            <a href="/?page=1" title="Previous Page">&amp;laquo;</a>
        </li>

        <li>
            <a href="/?page=1" title="Go to Page (1)" class="active">1</a>
        </li>

        <li>
            <a href="/?page=2" title="Go to Page (2)" class="">2</a>
        </li>

        <li>
            <a href="/?page=3" title="Go to Page (3)" class="">3</a>
        </li>

        <li>
            <a href="/?page=4" title="Go to Page (4)" class="">4</a>
        </li>

        <li>
            <a href="/?page=2" title="Next Page">&amp;raquo;</a>
        </li>

    </ul>

HTML:

    Returns => <div class="pagination ">

            <a href="/?page=1" title="Previous Page" class="prev-page">&amp;laquo;</a>

            <a href="/?page=1" title="Go to Page (1)" class="page active">1</a>

            <a href="/?page=2" title="Go to Page (2)" class="page ">2</a>

            <a href="/?page=3" title="Go to Page (3)" class="page ">3</a>

            <a href="/?page=4" title="Go to Page (4)" class="page ">4</a>

            <a href="/?page=2" title="Next Page" class="prev-page">&amp;raquo;</a>

    </div>

### json( ) `[type = 'function']`

Returns JSON for building custom pagination.

    paginator.json();

### Usage
    var json = pagination.json();

    => {
          total: 20,
          per_page: 5,
          current_page: 1,
          url: '/',
          params: {},
          page_param: 'page',
          show_next: true,
          show_prev: true,
          next_text: '&raquo;',
          prev_text: '&laquo;',
          size: null,
          number_of_pages: 4,
          number_of_links: 5,
          show_empty: true,
          theme: 'bootstrap',
          custom_template : null,
          pages:
           [ { url: '/?page=1', number: 1, class: 'active' },
             { url: '/?page=2', number: 2, class: '' },
             { url: '/?page=3', number: 3, class: '' },
             { url: '/?page=4', number: 4, class: '' } ],
          prev_url: '/?page=1',
          next_url: '/?page=2'
      }
