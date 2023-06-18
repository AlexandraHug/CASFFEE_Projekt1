Handlebars.registerHelper('formatDate', function (data) {
    return new Date(data).toLocaleDateString('de-DE'); //ES6
});

Handlebars.registerHelper('repeatText', function(text, n){
    return text.repeat(n);
})

