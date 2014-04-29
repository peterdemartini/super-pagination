var _ = require('lodash'),
    swig = require('swig,');

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
        number_pages : 5
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
    this.config = _.extend(this.config, settings);
    this.data = _.extend(this.data, this.config);
    var pages = [],
        start = this.config.current_page - Math.floor(this.config.number_pages / 2),
        end = this.config.current_page + Math.ceil(this.config.number_pages / 2);
    _.range(start, end).forEach(function(page){
        pages.push({
            url : this.generateUrl(page),
            number : page,
            class : page === this.config.current_page ? 'active' : ''
        });
    });
    this.data.pages = pages;
    this.data.prev_url = this.generateUrl(this.current_page - 1);
    this.data.next_url = this.generateUrl(this.current_page + 1);
    return this;
};

Paginator.prototype.render = function(){
    // Render HTML for bootstrap
    var html = swig.renderFile('../templates/bootstrap.html', {
        data : this.data
    });
    return html;
};

module.exports = Paginator;
