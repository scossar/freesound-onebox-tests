(function($) {
    // var audiosrc = $('.freesound-onebox').data('audio-src');
    // var playbutton = $('.freesound-play-btn');
    var sounds = {};
    var currentSound;
    var playerID;
    var audioSrc;
    var $pauseButton;
    var $playButton;
    var $timerDisplay;
    var $durationDisplay;
    var $freesoundProgress;
    var $freesoundCurrentWave;
    var sampleDuration;

    function formatTime(secs) {
    	var minutes = Math.floor(secs / 60) || 0;
    	var seconds = (secs - minutes * 60) || 0;

    	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    function step() {
    	var seek = sounds[currentSound].seek() || 0;
    	if (currentSound && sounds.hasOwnProperty(currentSound) && $timerDisplay) {
    		var seek = sounds[currentSound].seek();
    		$timerDisplay.html(formatTime(Math.round(seek)));
    		$freesoundProgress.css({
    			'width': ((seek / sampleDuration) * 100) + '%'
    		});

    		if (sounds[currentSound].playing()) {
    			requestAnimationFrame(step);
    		}
    	}
    }

    function assignVariables(self) {
    	playerID = $(self).data('player-id');
      audioSrc = $('#freesound-onebox-' + playerID).data('audio-src');
      $playButton = $('#freesound-play-' + playerID);
      $pauseButton = $('#freesound-pause-' + playerID);
      $timerDisplay = $('#freesound-timer-' + playerID);
      $freesoundProgress = $('#freesound-progress-' + playerID);
      $freesoundCurrentWave = $('#freesound-wave-' + playerID);
      $durationDisplay = $('#freesound-duration-' + playerID);
    }

    $('.freesound-wave').click(function(e) {
    	if ($(this).hasClass('current-wave')) {
    		var elementLeft = $(this).offset().left;
    		var pageLeft = e.pageX;
    		var chosenLocation = pageLeft - elementLeft;
    		var waveWidth = $(this).width();
    		var newPosition = chosenLocation * sampleDuration / waveWidth;
    		sounds[currentSound].seek(newPosition);
    	}
    });

    $('.freesound-play-btn').click(function() {
    	var soundID;

      soundID = 'sound_' + playerID;
      console.log('sounds', sounds);

      if (currentSound && sounds[currentSound].playing()) {
      	sounds[currentSound].pause();
      	$pauseButton.removeClass('active');
      	$playButton.addClass('active');
      }
      
      assignVariables(this);

      // if (currentSound && !currentSound === soundID) {
      	// if (sounds[currentSound].playing()) {
      		// sounds[currentSound].pause();
      	// }
      // }

      $freesoundCurrentWave.addClass('current-wave');

      currentSound = 'sound_' + playerID;

        if (!sounds.hasOwnProperty(currentSound)) {
        	  sounds[currentSound] = new Howl({
            src: audioSrc,
            html5: true,
            onplay: function() {
            	sampleDuration = sounds[currentSound].duration() || 0;
            	$durationDisplay.html(formatTime(Math.round(sampleDuration)));
            	requestAnimationFrame(step);
            },
            onload: function() {
            	// sampleDuration = sounds[currentSound].duration() || 0;
            	// $durationDisplay.html(sampleDuration);
            },

            onend: function() {
            	$playButton.addClass('active');
            	$freesoundCurrentWave.removeClass('current-wave');
              $pauseButton.removeClass('active');
            }
          });
        }

        sounds[currentSound].play();
        $playButton.removeClass('active');
        $pauseButton.addClass('active');

    });

    $('.freesound-pause-btn').click(function() {
    	// assignVariables(this);

      if (sounds.hasOwnProperty(currentSound)) {
        sounds[currentSound].pause();
        $(this).removeClass('active');
        $playButton.addClass('active');
        }
    });

})(jQuery);
