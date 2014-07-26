'use strict';

var _ = require('lodash'),
    swig = require('swig');

var Paginator = function(){
    this.config = {
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
        theme : 'bootstrap',
        custom_template : null
    };
    this.data = {};
    return this;
};

Paginator.prototype.generateUrl = function(page){
    var url = this.config.url;
    if(!url.match(/\?/)){
        url = url + '?' + this.config.page_param + '=' + page;
    }else{
        if(url.indexOf(this.config.page_param) > -1){
            var regex = new RegExp('/(' + this.config.page_param + '\\=\\d+)/');
            url = url.replace(regex, this.config.page_param + '=' + page);
        }else{
            url = url + '&' + this.config.page_param + '=' + page;
        }
    }
    return url;
};

Paginator.prototype.set = function(settings){
    // Set Configuration
    var _this = this;

    this.config = _.extend(this.config, settings);

    // Convert Strings to Ints in some cases
    this.config.current_page = parseInt(this.config.current_page);
    this.config.total = parseInt(this.config.total);
    this.config.number_of_pages = this.config.number_of_pages ? parseInt(this.config.number_of_pages) : Math.ceil(this.config.total / this.config.per_page);

    this.data = _.extend(this.data, this.config);

    // Create an array of pages
    var pages = [];

    var addPage = function(page){
        pages.push({
            url : _this.generateUrl(page),
            number : page,
            class : page === _this.config.current_page ? 'active' : ''
        });
    };

    if(this.config.number_of_links > this.config.number_of_pages){
        this.config.number_of_links = this.config.number_of_pages;
    }

    if(this.config.number_of_pages){
        var high = Math.ceil(this.config.number_of_links / 2),
            low = Math.floor(this.config.number_of_links / 2),
            start = this.config.current_page - low,
            end = this.config.current_page + high;
        if(end > this.config.number_of_pages){
            var endRem = end - this.config.number_of_pages;
            start = start - endRem;
            end = this.config.number_of_pages ? this.config.number_of_pages : 1;
        }

        if(start < 1){
            end = end + -start + 1;
            start = 1;
        }
        _.range(start, end).forEach(function(range){
            var page = range;
            addPage(page);
        });
    }

    if(pages.length === 0){
        addPage(this.data.current_page);
    }
    this.data.pages = pages;
    // Set Prev URL
    if(this.config.current_page > 1){
        this.data.show_prev = true;
        this.data.prev_url = this.generateUrl(this.config.current_page - 1 || 1);
    }else{
        this.data.show_prev = false;
    }
    // Set Next URL
    if(this.config.current_page < this.config.number_of_pages){
        this.data.show_next = true;
        this.data.next_url = this.generateUrl(this.config.current_page + 1 || 1);
    }else{
        this.data.show_next = false;
    }

    if(![
        'bootstrap',
        'html',
        'custom'
        ].indexOf(this.data.theme)){
        this.data.theme = 'bootstrap';
    }
    return this;
};

Paginator.prototype.json = function(){
    return this.data;
};

Paginator.prototype.render = function(){
    // Return blank
    if(!this.data.show_empty && this.data.pages.length <= 1) return '';
    // Render HTML for bootstrap
    var html;
    if(this.data.theme === 'custom'){
        html = swig.render(this.data.custom_template, {
            locals: {
                data : this.data
            }
        });
    }else{
        html = swig.renderFile(__dirname + '/../templates/'+this.data.theme+'.html', {
            data : this.data
        });
    }

    return html;
};

module.exports = Paginator;
