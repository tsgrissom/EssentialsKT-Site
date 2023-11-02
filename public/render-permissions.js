/* jshint browser: true, node: true */
const yaml = require('js-yaml');
const YML_URL = 'https://raw.githubusercontent.com/tsgrissom/EssentialsKT/main/src/main/resources/plugin.yml';

const specialPermissions = ['essentials.gamemode.noalter', 'essentialskt.disclosepermission'];

const isWildcardPermission = key => key.endsWith('.*');
const isEssentialsPermission = key => key.startsWith('essentials.');
const isSpecialPermission = key => specialPermissions.includes(key);

const renderPermissionAsRow = (k, v) => {
    let rowContents = '<td>';
    rowContents += isEssentialsPermission(k) ? '<code class="ess-perm">' : '<code>';
    rowContents += `${k}</code></td>`;

    const {description, children} = v;
    const def = v.default === undefined ? 'op' : v.default;

    if (description !== undefined) {
        rowContents += `<td>${description}</td>`;
    }

    rowContents += `<td>${def}</td>`;

    if (isWildcardPermission(k)) {
        if (children === undefined) {
            rowContents += `<td class="text-danger">None</td>`;
        } else {
            let childList = '<td><ul>';

            for (const [k, v] of Object.entries(children)) {
                childList += `<li>${k}: ${v}</li>`;
            }

            childList += '</ul></td>';
            rowContents += childList;
        }
    }

    return `
        <tr>
            ${rowContents}
        </tr>
    `;
};

const populateContents = data => {
    const {permissions} = data;
    const elemRegular = document.getElementById('table-regular');
    const elemSpecial = document.getElementById('table-special');
    const elemWildcard = document.getElementById('table-wildcard');

    let rowsRegular = '';
    let rowsWildcard = '';
    let rowsSpecial = '';

    for (const [k, v] of Object.entries(permissions)) {
        if (isSpecialPermission(k)) {
            rowsSpecial += renderPermissionAsRow(k, v);
            continue;
        }

        if (isWildcardPermission(k)) {
            rowsWildcard += renderPermissionAsRow(k, v);
            continue;
        }

        rowsRegular += renderPermissionAsRow(k, v);
    }

    const tStart = '<table class="table table-striped">';
    const tEnd = '</table>';
    const tHead = `
        <thead>
            <tr>
                <th class="col">Permission</th>
                <th class="col">Description</th>
                <th class="col">Default</th>
            </tr>
        </thead>
    `;
    const tHeadWildcard = `
        <thead>
            <tr>
                <th class="col">Permission</th>
                <th class="col">Description</th>
                <th class="col">Default</th>
                <th class="col">Children</th>
            </tr>
        </thead>
    `;

    const assembledRegular = `
        ${tStart}
            ${tHead}
            ${rowsRegular}
        ${tEnd}
    `;
    const assembledWildcard = `
        ${tStart}
            ${tHeadWildcard}
            ${rowsWildcard}
        ${tEnd}
    `;
    const assembledSpecial = `
        ${tStart}
            ${tHead}
            ${rowsSpecial}
        ${tEnd}
    `;

    elemRegular.innerHTML = assembledRegular;
    elemWildcard.innerHTML = assembledWildcard;
    elemSpecial.innerHTML = assembledSpecial;
};

fetch(YML_URL)
    .then(response => response.text())
    .then(text => yaml.load(text))
    .then(data => populateContents(data))
    .catch(err => console.error('Error:', err));