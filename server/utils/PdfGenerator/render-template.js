const fs = require("fs");
const path = require("path");
const hbs = require("handlebars");

// renders the html template with the given data and returns the html string
function renderTemplate(data) {
  // Pass enums on data to compile

  // Register template

  // Render main layout
  const html = fs.readFileSync(
    path.resolve("utils", "PdfGenerator", "index.hbs"),
    "utf-8"
  );

  // console.log(data.data);

  // creates the Handlebars template object
  const rendered = hbs.compile(html)(data);

  return rendered;
}

module.exports = renderTemplate;
