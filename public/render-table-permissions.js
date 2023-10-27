const yaml = require('js-yaml');
const YML_URL = 'https://raw.githubusercontent.com/tsgrissom/EssentialsKT/main/src/main/resources/plugin.yml';

const isWildcard = key => key.endsWith('.*');

fetch(YML_URL)
    .then(response => response.text())
    .then(text => yaml.load(text))
    .then(data => {
        const {permissions} = data;
        console.log('Permissions:', permissions);
    })
    .catch(err => {
        console.error('Error:', err);
    })