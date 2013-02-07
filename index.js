$(document).ready(function() {
    // update_progress();
});
function upd(){
  $('.progress .bar').progressbar({
      display_text: 2,
      use_percentage: false,
      update: function( current_percentage ) { console.log(current_percentage) },
      done: function( ) { console.log('done progressing') },
      fail: function( error_message ) { console.log(error_message) },
  });
}