var w;
$(document).ready(function() {

  $('#theme_controls button').click(function(){
    $('body').removeClass()
    $('body').addClass($(this).attr('data-theme'))
  });

  // import_srl_races_list();
  $('#import_list').click(function(){
    $(this).attr('disabled', true);
    import_srl_races_list();
  });
  $('#do_import').click(function(){
    var selection = $('#race_select').val();
    console.log('importing '+selection+'...')
    if(selection == 'custom_game'){
      console.log('no import, playing custom_game')
    }else{
      import_race(selection);
    }
  });

  $('#auto_title').click(function(){
    $('#heading').text($('#game_name').text()+' - '+$('#game_goal').text());
  });

  // update_progress();
  w = new Stopwatch(updateClock, 0.1); 
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
      $('.total-splits').each(function() {               // loop over all elements
        $(this).text(value)
      });
      upd();
    }else if(this.id == 'color'){
      $(this).parent().id
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
  sample_runner.color = random_color();
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
  // console.log(runner)
  // make a label
  // var label = $('#runner_name_label_template').clone();

  // label.attr('id', runner.id+'_label')
  // label.find('p').text(runner.name)
  // label.find('a').attr('href', runner.stream_url)
  // label.appendTo('#runner_name_labels')
  // label.show();

  var lhtml = Mustache.render($('#runner_name_label_template').html(), runner);
  $('#runner_name_labels').append(lhtml)

  // make their progress bar
  var bar = $('#runner_progress_bar_template').clone();
  bar.attr('id', runner.id+'_progressbar')
  the_bar = bar.find('.bar');
  the_bar.attr('data-amount-total', run.splits)
  the_bar.attr('data-amount-part', runner.current_split)
  // pick a nice color, we may need it later  
  the_bar.css({
    'background-image': 'none',
    'background-color': ((runner.color) ? runner.color : false) || random_color()
  });
  if(the_bar.css('background-color') != 'rgb(255, 255, 255)' || runner.color == 'white'){
  }else{
    the_bar.css('background-color', random_color());
  }
  bar.show();
  bar.appendTo('#runner_progress_bars')
  upd();

  // add them to the table
  runner['total_splits'] = run.splits
  var row = $('#runner_row_template').html();
  var output = Mustache.render(row, runner);
  $('#runner_rows').prepend(output)

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

function import_srl_races_list(){
  $.getJSON('http://speedrunslive.com:81/races/', function(result){
    console.log(result)
    var races = result.races
    if(races.length != null && races.length > 0){
      var race_select = $('#race_select');
      race_select.find('option').not('#custom_game').remove();
      var template = $('#race_option').html();
      for (var i = races.length - 1; i >= 0; i--) {
        race_select.append(Mustache.render(template, races[i]));
      };
    }
    $('#import_list').attr('disabled', false);
  });
}

function import_race(race_id){
  console.log(race_id+': race_id');

  $.getJSON('http://speedrunslive.com:81/races/'+race_id, function(result){
    console.log(result)
    var the_race = result
    var t = new Date() - new Date(the_race.time * 1000);
    w.setElapsed(0, 0, t/1000)
    $('#start').click();
    the_race.splits = 9
    var entrants = Object.keys(result['entrants'])
    var runners = []
    for (var i = entrants.length - 1; i >= 0; i--) {
      x = result['entrants'][entrants[i]]
      the_runner = {}
      the_runner.id = (x['twitch'] == null || x['twitch'] == undefined) ? random_id() : x['twitch']
      the_runner.name = x['displayname']
      the_runner.stream_url = 'http://twitch.tv/'+x['twitch']
      the_runner.color = random_color();
      the_runner.current_split = 0
      add_runner(the_runner, the_race);
    };
    $('#game_name').text(the_race.game.name)
    $('#game_goal').text(the_race.goal)
    $('#specific_page').text('/race/?id='+race_id)
    $('#specific_page').attr('href', 'http://www.speedrunslive.com/race/?id='+race_id)
  });
}

function random_id(){
  return Math.random().toString(36).slice(2);
}

function random_color(){
  var s = 'aqua, black, blue, fuchsia, gray, grey, green, maroon, navy, olive, purple, red, silver'
  var c = s.split(', ')
  var nice_color = c[Math.floor(Math.random() * c.length)];
  return nice_color
}