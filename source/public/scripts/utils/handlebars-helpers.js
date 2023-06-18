/* eslint-disable no-undef */
Handlebars.registerHelper('formatDate', (data) => 
     new Date(data).toLocaleDateString('de-DE')
);

Handlebars.registerHelper('repeatText', (text, n)=> text.repeat(n))

