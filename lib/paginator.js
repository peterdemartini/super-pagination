var _ = require('lodash'),
    swig = require('swig');

var Paginator = function(){
    this.config = {
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
    };
    this.data = {};
    return this;
};

Paginator.prototype.generateUrl = function(page){
    var url = this.config.url;
    if(!url.match(/\?/)){
        url = url + '?' + this.config.page_param + '=' + page;
    }else{
        if(url.indexOf(this.config.page_param)){
            regex = new RegExp('/(' + this.config.page_param + '\\=\\d+)/');
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
    this.config.number_of_pages = parseInt(this.config.number_of_pages);
    this.config.total = parseInt(this.config.total);
    this.data = _.extend(this.data, this.config);

    // Create an array of pages
    var pages = [],
        start = this.config.current_page - Math.floor(this.config.number_of_links / 2),
        end = this.config.number_of_pages > this.config.number_of_links ?  this.config.number_of_links : this.config.number_of_pages;
    start = start < 1 ? 1 : start;
    end = start + end;
    if(end !== start  + 1){
        _.range(start, end).forEach(function(range){
            var page = range;
            pages.push({
                url : _this.generateUrl(page),
                number : page,
                class : page === _this.config.current_page ? 'active' : ''
            });
        });
    }
    this.data.pages = pages;
    // Set Prev URL
    if(this.config.current_page > 0){
        this.data.prev_url = this.generateUrl(this.config.current_page - 1 || 1);
    }else{
        this.data.show_prev = false;
    }
    // Set Next URL
    if(this.config.current_page < this.config.number_of_pages){
        this.data.next_url = this.generateUrl(this.config.current_page + 1 || 1);
    }else{
        this.data.show_next = false;
    }
    return this;
};

Paginator.prototype.json = function(){
    return this.data;
};

Paginator.prototype.render = function(){
    // Return blank
    if(!this.data.show_empty && this.data.total < this.data.per_page) return '';
    // Render HTML for bootstrap
    var html = swig.renderFile(__dirname + '/../templates/bootstrap.html', {
        data : this.data
    });
    return html;
};

module.exports = Paginator;
