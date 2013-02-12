$(document).ready(function() {
  // update_progress();
  var w = new Stopwatch(updateClock, 0.1); 
  $('#start').click(function(){
    w.start();
    $(this).hide()
    $('#pause').show()
    $('#timer_container').removeClass('btn-danger');
    $('#timer_container').removeClass('btn-info');
    $('#timer_container').addClass('btn-inverse');
  });
  $('#pause').click(function(){
    w.stop();
    $(this).hide()
    $('#start').show()
    $('#timer_container').removeClass('btn-inverse');
    $('#timer_container').addClass('btn-info');
  });
  $('#pause').hide();

  $('#reset').click(function(){
    $('#pause').click();
    w.reset();
    $('#timer_container').removeClass('btn-info');
    $('#timer_container').addClass('btn-danger');
  });

  $('.edit').editable(function(value, settings) { 
		console.log(this);
		console.log(value);
		console.log(settings);
    if(this.id == 'game_splits'){
      $('.bar').attr('data-amount-total', value)
      $('#total_splits').text(value)
      upd();
    }
		return(value);
	}, { 
	});


  upd();

  // change pb color
  // $('#pb').css({
	//   'background-image': 'none',
	//   'background-color': 'red'
	// });
  var sample_runner = {}
  sample_runner.id = Math.random().toString(36).slice(2)
  sample_runner.name = 'Testrunner'
  sample_runner.stream_url = 'http://twitch.tv/testrunner'
  sample_runner.color = 'red'
  sample_runner.current_split = 1

  var sample_run = {}
  sample_run.splits = parseInt($('#game_splits').text());
  // splits will be an array of split objects
  // TODO: define what a split really is
  add_runner(sample_runner, sample_run);
  $(document).on('click', '#runner_rows_controls #add', function(e){
    the_input = $('#runner_rows_controls')
    a_runner = {}
    a_runner.id = Math.random().toString(36).slice(2)
    a_runner.name = the_input.find('#name').val()
    a_runner.color = the_input.find('#color').val()
    a_runner.stream_url = the_input.find('#stream_url').val()
    a_runner.current_split = the_input.find('#current_split').val()


    var the_run = {}
    the_run.splits = parseInt($('#game_splits').text());

    add_runner(a_runner, the_run)
    // should check success
    the_input.find('#name').val('')
    the_input.find('#color').val('')
    the_input.find('#stream_url').val('')
    the_input.find('#current_split').val('0')

  });




  $(document).on('click', '#increment_split', function(e){
    var runner_id = $(this).parent().attr('data-runner-id')
    var br = $('#'+runner_id+'_progressbar .bar')
    var n = parseInt(br.attr('data-amount-part'))
    var ns = (n + 1 <= parseInt(br.attr('data-amount-total'))) ? n + 1 : n 
    if(ns != n){
      br.attr('data-amount-part', ns)
      upd(br)
      $('#'+runner_id+'_row #current_split').text(ns)
    }
  });
  $(document).on('click', '#decrement_split', function(e){
    var runner_id = $(this).parent().attr('data-runner-id')
    var br = $('#'+runner_id+'_progressbar .bar')
    var n = br.attr('data-amount-part')
    var ns = (n - 1 >= 0) ? n - 1 : n 
    if(ns != n){
      br.attr('data-amount-part', ns)
      upd(br)
      $('#'+runner_id+'_row #current_split').text(ns)
    }
  });
  $(document).on('click', '#destroy', function(e){
    var runner_id = $(this).attr('data-runner-id')
    $('#'+runner_id+'_row').remove()
    $('#'+runner_id+'_progressbar').remove()
    $('#'+runner_id+'_label').remove()
  });


});
function add_runner(runner, run){
  console.log(runner)
  // make a label
  var label = $('#runner_name_label_template').clone();
  label.attr('id', runner.id+'_label')
  label.find('p').text(runner.name)
  label.find('a').attr('href', runner.stream_url)
  label.appendTo('#runner_name_labels')
  label.show();

  // make their progress bar
  var bar = $('#runner_progress_bar_template').clone();
  bar.attr('id', runner.id+'_progressbar')
  the_bar = bar.find('.bar');
  the_bar.attr('data-amount-total', run.splits)
  the_bar.attr('data-amount-part', runner.current_split)
  // pick a nice color, we may need it later  
  var nice_colors = ['blue', 'purple', 'gray']
  var nice_color = nice_colors[Math.floor(Math.random() * nice_colors.length)];
  the_bar.css({
    'background-image': 'none',
    'background-color': ((runner.color) ? runner.color : false) || nice_color
  });
  if(the_bar.css('background-color') != 'rgb(255, 255, 255)' || runner.color == 'white'){
  }else{
    the_bar.css('background-color', nice_color);
  }
  bar.show();
  bar.appendTo('#runner_progress_bars')
  upd();

  // add them to the table
  var row = $('#runner_row_template').clone();
  row.attr('id', runner.id+'_row')
  runner['total_splits'] = run.splits

  var output = Mustache.render(row.html(), runner);

  row.html(output)
  $(row).prependTo('#runner_rows')
  row.show();

}
function upd(a_specific_bar){
	// $('.progress .bar').progressbar();
  if(a_specific_bar){
  }else{
    a_specific_bar = $('.progress .bar');
  }
  a_specific_bar.progressbar({
      display_text: 1,
      use_percentage: false,
      update: function( current_percentage ) {
      	// console.log(current_percentage)
      	// $(this).text($(this).text()+'a')
      },
      done: function(){
      	// console.log('done progressing')
      	// $(this).text($(this).text()+'a')
    	},
      fail: function(error_message){
      	console.log(error_message)
      }
  });
}

function updateClock(w) {
    var watch = w.getElapsed();
    $('#timer').html(watch.hours+':'+paddy(watch.minutes, 2)+':'+paddy(watch.seconds, 2)+'.'+paddy(watch.milliseconds, 2));
}

function paddy(n, p, c) {
  var pad_char = typeof c !== 'undefined' ? c : '0';
  var pad = new Array(1 + p).join(pad_char);
  return (pad + n).slice(-pad.length);
}