var _ = require('lodash');

var Paginator = function(){
    this.config = {
    };
    return this;
};

Paginator.prototype.set = function(settings){
    // Set Configuration
    this.config = _.extend(this.config, settings);
    return this;
};

Paginator.prototype.render = function(){
    // Render HTML for bootstrap
    var html = '';
    return html;
};
