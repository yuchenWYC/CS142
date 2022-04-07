'use strict';

function TableTemplate() {
}

TableTemplate.fillIn = function(table_id, map, columnName=undefined) {
    // tracing down the element tree
    const table = document.getElementById(table_id);
    const tbody = table.children[0];
    const header = tbody.children[0];
    const header_cols = header.children;

    let k = 0; // keep tracks of index of specified column
    // process the header row
    for (let i = 0; i < header_cols.length; i++){
        const template_processor = new Cs142TemplateProcessor(header_cols[i].textContent);
            header_cols[i].textContent = template_processor.fillIn(map);
        if (header_cols[i].textContent === columnName){
            k = i;
        }
    }
    
    if (columnName) {  // if a column name is specified
        let row = header.nextElementSibling;
        while (row) {
            const cols = row.children;
            const template_processor = new Cs142TemplateProcessor(cols[k].textContent);
            cols[k].textContent = template_processor.fillIn(map);
            row = row.nextElementSibling;
        }
    } else {  // if a column name is not specified
        for (let i = 1; i < tbody.children.length; i++){
            const cols = tbody.children[i].children;
            for (let j = 0; j < cols.length; j++){
                const template_processor = new Cs142TemplateProcessor(cols[j].textContent);
                cols[j].textContent = template_processor.fillIn(map);
            }
        }
    }

    // set tables to visible
    table.style.visibility = "visible";
};