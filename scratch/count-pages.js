const fs = require('fs');

const html = fs.readFileSync('d:\\multitenancy\\multitenancy_frontend\\src\\app\\add-account\\form\\banks\\kumbhi-form\\kumbhi-form.component.html', 'utf8');

const regex = /class="form-page"/g;
const matches = html.match(regex);
console.log('Matches for class="form-page":', matches ? matches.length : 0);

const regexPage = /form-page/g;
const matchesPage = html.match(regexPage);
console.log('Matches for form-page:', matchesPage ? matchesPage.length : 0);
