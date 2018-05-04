function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

var url = "https://api.soundcloud.com/tracks/";
var urls = [
    {id:"343982131", name:"Sunset"},
    {id:"343982127", name:"Coral Bay"},
    {id:"343982125", name:"Bullet Train"},
    {id:"343982123", name:"Scarab"},
    {id:"343982122", name:"Not So Humble Beginnings"},
    {id:"343982120", name:"Pizza"},
    {id:"343982119", name:"Lapping Waves"},
    {id:"343982116", name:"Bat Boy"},
    {id:"343982113", name:"Ahoy There!"},
    {id:"343982112", name:"Frozen Castle"},
	  {id:"419896772", name:"Sky Fisher: Overworld"},
	  {id:"419896784%3Fsecret_token%3Ds-cE6qs", name:"Sky Fisher: Shop"}
]
var index = 0;
var options = [];
options.auto_play = false;
urls = shuffle(urls);
var loaded = false;
var playing = false;
var soundLoading = false;
var firstPlay = true;

var text_ready = "Ready!";
var text_paused = "Paused.";
var text_playing = "Now Playing: ";
var text_loading = "Loading...";
var text_index = 0;

var currentText = "";
var nextText = "";
var changing = false;
var direction = -1;
var waiting = false;

function changeText() {
    if ( waiting ) { return; }    
    if ( !changing ) { return; }

    if ( direction < 0 ) {
        text_index--;
        currentText = currentText.substring(0,text_index);    
        if (text_index <= 0) {
            direction = 1;
        }
    } else {
        text_index++;
        currentText = nextText.substring(0,text_index);        
        if ( text_index >= nextText.length ) {
            text_index = 0;
            changing = false;
            direction = -1;
        }
    }
    $("#player-text").text(currentText);   
}

function setText() {
    if (changing) {
        setTimeout(function() {
            setText();
        }, 100);
        return;
    }

    if (!playing && firstPlay) {
        nextText = text_ready;
        if ( nextText == currentText ) { return; }
        changing = true;
        text_index = currentText.length;
        return;
    }

    if (!playing) {
        nextText = text_paused;
        if ( nextText == currentText ) { return; }
        changing = true;
        text_index = currentText.length;
        return;
    }

    if (soundLoading) {
        nextText = text_loading;
        if ( nextText == currentText ) { return; }
        changing = true;
        text_index = currentText.length;
        return;
    }

    if (playing) {
        nextText = text_playing + urls[index].name;
        if ( nextText == currentText ) { return; }
        changing = true;
        text_index = currentText.length;
        return;
    }

}

function nextTrack () {
    index++;
    if ( index >= urls.length ) {
        index = 0;
    }
    options.auto_play = true;
    widget.load(url + urls[index].id, options);
}

$(document).ready(function() {
    $('#youtube').addClass('animated fadeInLeft');
    $('#youtube').removeClass('hidden');

    $('#soundcloud').addClass('animated fadeInLeft');
    $('#soundcloud').removeClass('hidden');

    $('#bandcamp').addClass('animated fadeInLeft');
    $('#bandcamp').removeClass('hidden');

    if (window.matchMedia('screen and (max-width: 550px)').matches) { return; }
    var widget = SC.Widget(document.getElementById('soundcloud-widget'));
    widget.bind(SC.Widget.Events.READY, function() {
        if (!loaded) {
            loaded = true;
            $('#player').addClass('animated slideInLeft');
            $('#player').removeClass('hidden');
            setTimeout(function(){
                $('#prev-track-button').addClass('animated fadeInUp');
                $('#prev-track-button').removeClass('hidden');
                $('#play-button').addClass('animated fadeInUp');
                $('#play-button').removeClass('hidden');
                $('#next-track-button').addClass('animated fadeInUp');
                $('#next-track-button').removeClass('hidden');
                $('#player-text').addClass('animated fadeInUp');
                $('#player-text').removeClass('hidden');
            },1000);
            setText();
            setInterval(function() {
                changeText();
            },20);            
        }
    });
    widget.bind(SC.Widget.Events.FINISH, function() {
        index++;
        if ( index >= urls.length ) {
            index = 0;
        }
        options.auto_play = true;
        widget.load(url + urls[index].id, options);
        if (!playing) {
            $("#play-button").attr("src","./img/player-pause.png");
            playing = true;
        }

        soundLoading = true;
        setText();
    });

    widget.bind(SC.Widget.Events.PLAY, function() {
        soundLoading = false;
        setText();
    });

    $('#play-button').click(function() {
      widget.toggle();
      playing = !playing;
      if (playing) {
        $("#play-button").attr("src","./img/player-pause.png");
      } else {
        $("#play-button").attr("src","./img/player-play.png");
      }

      if (firstPlay) {
        soundLoading = true;
        firstPlay = false;
      }
      setText();
    });

    $('#next-track-button').click(function() {
        index++;
        if ( index >= urls.length ) {
            index = 0;
        }
        options.auto_play = true;
        widget.load(url + urls[index].id, options);
        if (!playing) {
            $("#play-button").attr("src","./img/player-pause.png");
            playing = true;
        }

        soundLoading = true;
        setText();
    });

    $('#prev-track-button').click(function() {
        index--;
        if ( index < 0 ) {
            index = urls.length - 1;
        }
        options.auto_play = true;
        widget.load(url + urls[index].id, options);
        if (!playing) {
            $("#play-button").attr("src","./img/player-pause.png");
            playing = true;
        }

        soundLoading = true;
        setText();
    });

    widget.load(url + urls[index].id, options);
});
