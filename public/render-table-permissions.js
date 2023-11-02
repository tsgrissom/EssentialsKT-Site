const yaml = require('js-yaml');
const YML_URL = 'https://raw.githubusercontent.com/tsgrissom/EssentialsKT/main/src/main/resources/plugin.yml';

const isWildcard = key => key.endsWith('.*');

fetch(YML_URL)
    .then(response => response.text())
    .then(text => yaml.load(text))
    .then(data => {
        const {permissions} = data;
        const elem = document.getElementById('paragraph-permissions');
        let parsed = '';

        for (const [k, v] of Object.entries(permissions)) {
            console.log(`${k}: ${v}`);
            parsed += `<span>${k}</span><br>`;
        }

        elem.innerHTML = parsed;
    })
    .catch(err => {
        console.error('Error:', err);
    })