// Bind handlers when the page loads.
$(function() {
  $('a.mdl-button').click(function() {
    setSpinnerActive(true);
  });
});

function showError(error) {
  console.log(error);
  var snackbar = $('#snackbar');
  snackbar.addClass('error');
  snackbar.get(0).MaterialSnackbar.showSnackbar(error);
}





// TODO: Add Google Sign-in.
function onSignIn(user) {
  var profile = user.getBasicProfile();
  $('#profile .name').text(profile.getName());
  $('#profile .email').text(profile.getEmail());
}


// TODO: Add spreadsheet control handlers.
$(function() {
  $('button[rel="create"]').click(function() {
    makeRequest('POST', '/spreadsheets', function(err, spreadsheet) {
      if (err) return showError(err);
      window.location.reload();
    });
  });
  $('button[rel="sync"]').click(function() {
    var spreadsheetId = $(this).data('spreadsheetid');
    var url = '/spreadsheets/' + spreadsheetId + '/sync';
    makeRequest('POST', url, function(err) {
      if (err) return showError(err);
      alert('Sync complete.');
    });
  });
});

function makeRequest(method, url, callback) {
  var auth = gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) {
    return callback(new Error('Signin required.'));
  }
  var accessToken = auth.currentUser.get().getAuthResponse().access_token;

  $.ajax(url, {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response) {
      return callback(null, response);
    },
    error: function(response) {
      setSpinnerActive(false);
      return callback(new Error(response.responseJSON.message));
    }
  });
}
