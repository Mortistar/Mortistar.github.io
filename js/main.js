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

var playlists = [
    {name: "Showreel", urls: [
		{id:"343982122", name:"Not So Humble Beginnings"},
        {id:"419896772%3Fsecret_token%3Ds-KktnH", name:"Sky Fisher: Overworld"},
        {id:"343982125", name:"Bullet Train"},
        {id:"453207072", name:"Restless Crypt"},
		{id:"453216048", name:"DOGBOSS"},
        {id:"343982120", name:"Pizza"},
		{id:"477640437", name:"Gleaming Forest"},
        {id:"336462999", name:"Leaf Town"},
        {id:"453211890", name:"Meadowlands"}
    ]},
	{name: "Chiptune", urls: [
		{id:"343982122", name:"Not So Humble Beginnings"},
		{id:"336462999", name:"Leaf Town"},
		{id:"343982120", name:"Pizza"},
		{id:"477636498", name:"Icicle Cave"},
        {id:"343982131", name:"Sunset"},
		{id:"477635823", name:"Dreams of a Lost Hamlet"},
        {id:"343982127", name:"Coral Bay"},
		{id:"453210408", name:"MainThemeVania"},
        {id:"343982125", name:"Bullet Train"},
		{id:"477641256%3Fsecret_token%3Ds-tWEzI", name:"Layers Plus Theme"},
        {id:"343982123", name:"Scarab"},
        {id:"477637125", name:"Blossom: Echoes"},
        {id:"343982119", name:"Lapping Waves"},
        {id:"343982116", name:"Bat Boy"}
    ]},
	{name: "Orchestral Hybrid", urls: [
		{id:"453207072", name:"Restless Crypt"},
		{id:"419896772%3Fsecret_token%3Ds-KktnH", name:"Sky Fisher: Overworld"},
		{id:"477640437", name:"Gleaming Forest"},
        {id:"419896784%3Fsecret_token%3Ds-cE6qs", name:"Sky Fisher: Shop"}
    ]},
	{name: "Orchestral", urls: [
		{id:"453211890", name:"Meadowlands"},
		{id:"477637272%3Fsecret_token%3Ds-x5kRY", name:"Blossom: Echoes"},
		{id:"477640038", name:"Fields of Bloom"}
    ]},
	{name: "Misc", urls: [
		{id:"453216048", name:"DOGBOSS"},
		{id:"477701751", name:"Transistor"},
		{id:"477640650%3Fsecret_token%3Ds-4Sojb", name:"Lucky Towers Theme"},
		{id:"477701952", name:"The Mall"},
		{id:"477641274%3Fsecret_token%3Ds-Wp3ta", name:"Layers Plus Challenge Mode"},
		{id:"477702090", name:"Cracked Neon"}
    ]}
]
var selectedPlaylist = 0;
var playlistShowing = false;

var url = "https://api.soundcloud.com/tracks/";
var index = 0;
var options = [];
options.auto_play = false;
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

function generatePlaylistContainer() {
    for (var i = 0; i < playlists.length; i++) {
        var selectedClass = selectedPlaylist == i ? "selected-content" : "unselected-content";
        $('#playlist-dropup').append("<div id='playlist-content-" + i + "' class='playlist-dropup-content " + selectedClass +"'><p class='playlist-content-text noselect'>" + playlists[i].name + "</p></div>");
    }
}

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
        nextText = text_playing + playlists[selectedPlaylist].urls[index].name;
        if ( nextText == currentText ) { return; }
        changing = true;
        text_index = currentText.length;
        return;
    }

}

function nextTrack () {
    index++;
    if ( index >= playlists[selectedPlaylist].urls.length ) {
        index = 0;
    }
    options.auto_play = true;
    widget.load(url + playlists[selectedPlaylist].urls[index].id, options);
}

$(document).ready(function() {
    generatePlaylistContainer();

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
                $('#change-playlist-button').addClass('animated fadeInUp');
                $('#change-playlist-button').removeClass('hidden');
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
        if ( index >= playlists[selectedPlaylist].urls.length ) {
            index = 0;
        }
        options.auto_play = true;
        widget.load(url + playlists[selectedPlaylist].urls[index].id, options);
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

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
        if (soundLoading)
        {
            soundLoading = false;
            setText();
        }
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
        if ( index >= playlists[selectedPlaylist].urls.length ) {
            index = 0;
        }
        options.auto_play = true;
        widget.load(url + playlists[selectedPlaylist].urls[index].id, options);
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
            index = playlists[selectedPlaylist].urls.length - 1;
        }
        options.auto_play = true;
        widget.load(url + playlists[selectedPlaylist].urls[index].id, options);
        if (!playing) {
            $("#play-button").attr("src","./img/player-pause.png");
            playing = true;
        }

        soundLoading = true;
        setText();
    });

    $('#change-playlist-button').click(function() {
        if (playlistShowing) {
            $('#playlist-dropup').addClass('hidden');            
        } 
        else {            
            $('#playlist-dropup').removeClass('hidden');            
        }

        playlistShowing = !playlistShowing;
    });

    for (var i = 0; i < playlists.length; i++) {
        $('#playlist-content-' + i).click(function() {
            var currentIndex = this.id.match(/\d+$/)[0];
            if (selectedPlaylist != currentIndex)
            {
                $('#playlist-content-' + selectedPlaylist).removeClass('selected-content');
                $('#playlist-content-' + selectedPlaylist).addClass('unselected-content');

                $('#playlist-content-' + currentIndex).addClass('selected-content');
                $('#playlist-content-' + currentIndex).removeClass('unselected-content');
                
                selectedPlaylist = currentIndex;
                index = 0;
                options.auto_play = true;
                widget.toggle();
                widget.load(url + playlists[selectedPlaylist].urls[index].id, options);                
                widget.toggle();
                if (!playing) {
                    $("#play-button").attr("src","./img/player-pause.png");
                    playing = true;
                }

                if (firstPlay) {
                    firstPlay = false;
                }
                soundLoading = true;
                
                setText();
            }
        });
    }

    widget.load(url + playlists[selectedPlaylist].urls[index].id, options);
});
