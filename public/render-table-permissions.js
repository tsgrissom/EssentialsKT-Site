const yaml = require('js-yaml');
const YML_URL = 'https://raw.githubusercontent.com/tsgrissom/EssentialsKT/main/src/main/resources/plugin.yml';

const specialPermissions = ['essentials.gamemode.noalter', 'essentialskt.disclosepermission'];

const isWildcardPermission = key => key.endsWith('.*');
const isEssentialsPermission = key => key.startsWith('essentials.');
const isEssKtPermission = key => key.startsWith('essentialskt.');

const isSpecialPermission = key => specialPermissions.includes(key);

const displayPermission = (k, v) => {
    let elem = '';
    elem += isEssentialsPermission(k) ? '<span class="ess-perm">' : '<span>';
    elem += `${k}</span><br>`;
    return elem;
}

fetch(YML_URL)
    .then(response => response.text())
    .then(text => yaml.load(text))
    .then(data => {
        const {permissions} = data;
        const permissionsElem = document.getElementById('paragraph-permissions');
        const wildcardsElem = document.getElementById('paragraph-wildcards');
        const specialElem = document.getElementById('paragraph-special');
        let parsed = '';
        let parsedWildcards = '';
        let parsedSpecial = '';

        for (const [k, v] of Object.entries(permissions)) {
            console.log(`${k}: ${v}`);
            if (isSpecialPermission(k)) {
                parsedSpecial += displayPermission(k, v);
                continue
            }

            if (isWildcardPermission(k)) {
                parsedWildcards += displayPermission(k, v)
                continue
            }

            parsed += displayPermission(k, v);
        }

        permissionsElem.innerHTML = parsed;
        wildcardsElem.innerHTML = parsedWildcards;
        specialElem.innerHTML = parsedSpecial;
    })
    .catch(err => {
        console.error('Error:', err);
    })