'use strict';

function Cs142TemplateProcessor(template){
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary){
    const re = /\{\{[^{}]*\}\}/g;
    let result = this.template;
    const properties = result.match(re);
    for (let i = 0; i < properties.length; i++){
        const property = properties[i].slice(2, -2);
        if (dictionary[property] === undefined) {
            result = result.replace(properties[i], "");
        } else {
            result = result.replace(properties[i], dictionary[property]);
        }
    }
    return result;
};
