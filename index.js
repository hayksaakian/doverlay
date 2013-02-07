$(document).ready(function() {
    // update_progress();
    $('.edit').editable(function(value, settings) { 
			console.log(this);
			console.log(value);
			console.log(settings);
			return(value);
		}, { 
		});
    upd();
});
function upd(){
	// $('.progress .bar').progressbar();
  $('.progress .bar').progressbar({
      display_text: 1,
      use_percentage: false,
      update: function( current_percentage ) {
      	console.log(current_percentage)
      	// $(this).text($(this).text()+'a')
      },
      done: function(){
      	console.log('done progressing')
      	// $(this).text($(this).text()+'a')
    	},
      fail: function(error_message){
      	console.log(error_message)
      }
  });
}