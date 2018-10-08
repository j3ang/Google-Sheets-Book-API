var google = require('googleapis');
var googleAuth = require('google-auth-library');
var util = require('util');

/**
 * Create a new Sheets helper.
 * @param {string} accessToken An authorized OAuth2 access token.
 * @constructor
 */
var SheetsHelper = function(accessToken) {
  var authClient = new googleAuth();
  var auth = new authClient.OAuth2();
  auth.credentials = {
    access_token: accessToken
  };
  this.service = google.sheets({version: 'v4', auth: auth});
};

module.exports = SheetsHelper;

/**
 * Create a spreadsheet with the given name.
 * @param  {string}   title    The name of the spreadsheet.
 * @param  {Function} callback The callback function.
 */
SheetsHelper.prototype.createSpreadsheet = function(title, callback) {
  var self = this;
  var request = {
    resource: {
      properties: {
        title: title
      },
      sheets: [
        {
          properties: {
            title: 'Data',
            gridProperties: {
              columnCount: 3,
              frozenRowCount: 1
            }
          }
        },
        // TODO: Add more sheets.
      ]
    }
  };
  self.service.spreadsheets.create(request, function(err, spreadsheet) {
    if (err) {
      return callback(err);
    }
    // Add header rows.
    var dataSheetId = spreadsheet.sheets[0].properties.sheetId;
    var requests = [
      buildHeaderRowRequest(dataSheetId),
    ];
    // TODO: Add pivot table and chart.
    var request = {
      spreadsheetId: spreadsheet.spreadsheetId,
      resource: {
        requests: requests
      }
    };
    self.service.spreadsheets.batchUpdate(request, function(err, response) {
      if (err) {
        return callback(err);
      }
      return callback(null, spreadsheet);
    });

  });
};

var COLUMNS = [
  { field: 'id', header: 'ID' },
  { field: 'bookName', header: 'Book Name'},
  { field: 'bookAuthor', header: 'Book Author' },
];

/**
 * Builds a request that sets the header row.
 * @param  {string} sheetId The ID of the sheet.
 * @return {Object}         The reqeuest.
 */
function buildHeaderRowRequest(sheetId) {
  var cells = COLUMNS.map(function(column) {
    return {
      userEnteredValue: {
        stringValue: column.header
      },
      userEnteredFormat: {
        textFormat: {
          bold: true
        }
      }
    }
  });
  return {
    updateCells: {
      start: {
        sheetId: sheetId,
        rowIndex: 0,
        columnIndex: 0
      },
      rows: [
        {
          values: cells
        }
      ],
      fields: 'userEnteredValue,userEnteredFormat.textFormat.bold'
    }
  };
}

/**
 * Sync the books to a spreadsheet.
 * @param  {string}   spreadsheetId The ID of the spreadsheet.
 * @param  {string}   sheetId       The ID of the sheet.
 * @param  {Array}    books        The list of books.
 * @param  {Function} callback      The callback function.
 */
SheetsHelper.prototype.sync = function(spreadsheetId, sheetId, books, callback) {
  var requests = [];
  // Resize the sheet.
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId: sheetId,
        gridProperties: {
          rowCount: books.length + 1,
          columnCount: COLUMNS.length
        }
      },
      fields: 'gridProperties(rowCount,columnCount)'
    }
  });
  // Set the cell values.
  requests.push({
    updateCells: {
      start: {
        sheetId: sheetId,
        rowIndex: 1,
        columnIndex: 0
      },
      rows: buildRowsForBooks(books),
      fields: '*'
    }
  });
  // Send the batchUpdate request.
  var request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: requests
    }
  };
  this.service.spreadsheets.batchUpdate(request, function(err) {
    if (err) {
      return callback(err);
    }
    return callback();
  });
};

/**
 * Builds an array of RowData from the books provided.
 * @param  {Array} books The books.
 * @return {Array}        The RowData.
 */
function buildRowsForBooks(books) {
  return books.map(function(book) {
    var cells = COLUMNS.map(function(column) {
      switch (column.field) {
        case 'bookName':
          return {
            userEnteredValue: {
              stringValue: book.bookName
            }
          };
          break;
        case 'bookAuthor':
          return {
            userEnteredValue: {
              stringValue: book.bookAuthor
            }
          };
          break;

        default:
          return {
            userEnteredValue: {
              stringValue: book[column.field].toString()
            }
          };
      }
    });
    return {
      values: cells
    };
  });
}
