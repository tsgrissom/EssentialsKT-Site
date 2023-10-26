const rowReplacement = document.getElementById('row-replacement-commands');
const rowOriginal = document.getElementById('row-original-commands');
const rowGrouped = document.getElementById('row-grouped-commands');

const generateRow = entry => {
    const {aliases, command, description, permissions, source} = entry
    const columnNone = '<th><p class="text-danger">None</p></th>';
    let row = '<tr>';

    if (source.text !== undefined) {
        const {text, url} = source;
        const href = url !== undefined ? url : '#';
        row += `
                <th scope="row">
                    <a class="table-link" href="${href}" aria-label="Go to source code of /${command} command">
                        ${text}
                    </a>
                </th>
            `;
    }

    row += `
            <th>
                <code>/${command}</code>
            </th>
        `

    if (aliases === undefined || aliases.length === 0) {
        row += columnNone;
    } else {
        let aliasesAsList = '';

        for (let i=0; i<aliases.length; i++) {
            aliasesAsList += `<code>${aliases[i]}</code>`;
            if (i !== (aliases.length - 1)) {
                aliasesAsList += ', ';
            }
        }

        row += `
                <th>
                    ${aliasesAsList}
                </th>
            `;
    }

    if (permissions === undefined || permissions.length === 0) {
        row += columnNone;
    } else {
        let permissionsAsListItems = '';

        for (const p of permissions) {
            const codeTag = p.startsWith('essentials.')
                ? `<code class="ess-perm">${p}</code>`
                : `<code>${p}</code>`;
            permissionsAsListItems += `<li>${codeTag}</li>`;
        }

        row += `
                <th>
                    <ul>
                        ${permissionsAsListItems}
                    </ul>
                </th>
            `;
    }

    if (description === undefined) {
        row += columnNone;
    } else {
        row += `
                <th>
                    <p class="fw-light">
                        ${description}
                    </p>
                </th>  
            `;
    }

    row += '</tr>';
    return row;
}

const populateTable = (element, data) => {
    let allRows = '';

    for (const entry of data) {
        const row = generateRow(entry);
        allRows += row;
    }

    const tHead = `
        <thead>
            <tr>
                <th class="col">Source</th>
                <th class="col">Command</th>
                <th class="col">Aliases</th>
                <th class="col">Permissions</th>
                <th class="col">Description</th>
            </tr>
        </thead>
    `
    const tBody = `
        <tbody>
            ${allRows}
        </tbody>
    `;
    element.innerHTML = `
        <table class="table table-striped">
            ${tHead}
            ${tBody}
        </table>
    `
}

fetch('../commands.json')
    .then(response => response.json())
    .then(data => {
        const {grouped, original, replacement} = data;
        const noneText = '<p class="lead text-danger">None</p>';

        if (grouped.length === 0) {
            rowGrouped.innerHTML = noneText;
        } else {
            populateTable(rowGrouped, grouped);
        }

        if (original.length === 0) {
            rowOriginal.innerHTML = noneText;
        } else {
            populateTable(rowOriginal, original);
        }

        if (replacement.length === 0) {
            rowReplacement.innerHTML = noneText;
        } else {
            populateTable(rowReplacement, replacement);
        }
    })
    .catch(err => {
        console.error('Error:', err)
    });

