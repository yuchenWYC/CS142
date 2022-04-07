'use strict';

function DatePicker(div_id, callback) {
    this.div_id = div_id;
    this.callback = callback;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function render_month(datepicker, element, date, title, table, left_button, right_button) {
    /**
     * Render dynamic elements of the calendar.
     */
    
    // filling the title as month name + year
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    title.textContent = monthNames[date.getMonth()] + " " + date.getFullYear();

    // declare useful variables for the for-loop
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const month_length = lastDayOfMonth.getDate();
    let cur_date = new Date(date.getFullYear(), date.getMonth(), 1);
    const first_day = cur_date.getDay(); // Sun = 0, Sat = 6
    var current_month = date.getMonth() + 1;
    var current_year = date.getFullYear();

    // filling the table content
    removeAllChildNodes(table);
    table.innerHTML = "<th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>";
    let i = 1; // keeps track of date
    let j = 0; // keeps track of number of iteration
    while (i <= month_length) {
        const new_row = document.createElement("tr");
        for (let k = 0; k < 7; k++) {
            const new_col = document.createElement("td");
            if (j >= first_day) {
                new_col.textContent = cur_date.getDate();
                // assign on-click event for this cell
                if (i <= month_length) {
                    const date_map = {
                        year: current_year,
                        month: current_month,
                        day: new_col.textContent
                    };
                    new_col.onclick = function () {
                        datepicker.callback(datepicker.div_id, date_map);
                    };
                } else {
                    new_col.setAttribute("class", "dimmed");
                }

                cur_date = new Date(cur_date.getFullYear(), cur_date.getMonth(),
                    cur_date.getDate() + 1);
                i++;
            } else {
                const old_date = new Date(cur_date.getFullYear(), cur_date.getMonth(),
                    cur_date.getDate() - (first_day - j));
                new_col.textContent = old_date.getDate();
                new_col.setAttribute("class", "dimmed");
            }

            new_row.appendChild(new_col);
            j++;
        }
        table.appendChild(new_row);
    }

    // setting onclick events for left and right buttons
    var left_date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    left_button.onclick = function () {
        render_month(DatePicker, element, left_date, title, table, left_button, right_button);
    };

    var right_date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    right_button.onclick = function () {
        render_month(DatePicker, element, right_date, title, table, left_button, right_button);
    };
}

DatePicker.prototype.render = function (date) {
    /**
     * Declaring static elements of the calendar.
     */
    const element = document.getElementById(this.div_id);

    var left_button = document.createElement("button");
    left_button.textContent = "<";
    left_button.setAttribute("class", "button left");
    element.appendChild(left_button);

    // create title for calendar
    var title = document.createElement("span");
    element.appendChild(title);
    title.setAttribute("class", "title");

    var right_button = document.createElement("button");
    right_button.textContent = ">";
    right_button.setAttribute("class", "button right");
    element.appendChild(right_button);

    // create calendar table
    var table = document.createElement("table");
    element.appendChild(table);

    render_month(this, element, date, title, table, left_button, right_button);

};