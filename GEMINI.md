## Project Overview

This project is a "Todolog" web application. It's a simple, client-side todo list application that allows users to:

1.  Add new todo items.
2.  View a list of open todo items.
3.  Mark items as complete.
4.  View a log of completed items, grouped by date.

The application is built using vanilla JavaScript, HTML, and CSS. It uses the browser's `localStorage` to persist the todo list data, making it a self-contained, serverless application.

### Key Files

*   `index.html`: The main HTML file containing the structure of the application.
*   `style.css`: The stylesheet for the application.
*   `app.js`: Contains all the JavaScript logic for handling todos, rendering lists, and interacting with `localStorage`.

## Running the Application

There is no build process or server required for this project.

To run the application, simply open the `index.html` file in a web browser.

## Development Conventions

*   **Data Storage:** All todo items are stored in a single array in `localStorage` under the key `'todos'`.
*   **Data Model:** Each todo is an object with the following structure:
    *   `text`: The description of the todo item.
    *   `created`: The date the item was created.
    *   `completed`: The date the item was completed, or `null` if it is still open.
*   **Code Style:** The code is written in a simple, procedural style within the `app.js` file. All logic is contained within a single DOMContentLoaded event listener to ensure the DOM is ready before execution.
