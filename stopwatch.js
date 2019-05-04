$(document).ready(function() {
  var execution = 0,
    intervalSetup = null,
    startTime = null,
    pauseTime = null,
    pauseDuration = 0;

  $("body").keyup(function(e) {
    if (e.keyCode == 32) {
      start();
    }
  });

  $("#start-pause").on("click", start);
  $("#reset").on("click", reset);

  function start() {
    if (execution) {
      // Since there is an execution, user wants to pause the stopwatch.
      // So the first thing to do is to clear interval and save the pause
      // time incase user decides to resume later.
      clearInterval(intervalSetup);
      pauseTime = new Date();
      execution = 0;
      $("#start-pause").text("START");
      $("#start-pause").css("color", "yellowgreen");
    } else {
      // Which means stopwatch is not running. In this case, users click
      // could either starts the stopwatch for the first time, or had already
      // started but paused earlier (so it is currently not running) but wants
      // to resume where it was left off. Therefore, we need to distinguish
      // these cases and act accordingly. (Note that, if user had previously
      // clicked reset, we don't need to take any extra action, since that
      // case has same scenario as user clicks start for the first time.)
      if (pauseTime === null) {
        // If pauseTime is null, we can be sure that user clicked for the first time.
        startTime = new Date();
        intervalSetup = setInterval(count, 10);
        execution = 1;
        $("#start-pause").text("PAUSE");
        $("#start-pause").css("color", "darkorange");
      } else {
        // Since pauseTime is not null, we can be sure that user wants to resume.
        pauseDuration += new Date() - pauseTime;
        intervalSetup = setInterval(count, 10);
        execution = 1;
        $("#start-pause").text("PAUSE");
        $("#start-pause").css("color", "darkorange");
      }
    }
  }

  function reset() {
    clearInterval(intervalSetup);
    pauseDuration = 0;
    startTime = null;
    pauseTime = null;
    execution = 0;
    $("#stopwatch").text("00:00:00");
    $("#start-pause").text("START");
    $("#start-pause").css("color", "yellowgreen");
  }

  function count() {
    var elapsedTime = new Date(new Date() - startTime - pauseDuration);
    var hr = elapsedTime.getUTCHours(),
      min = elapsedTime.getUTCMinutes(),
      sec = elapsedTime.getUTCSeconds(),
      ms = elapsedTime.getUTCMilliseconds();

    $("#stopwatch").text(
      handleZeros(hr, 2) + ":" + handleZeros(min, 2) + ":" + handleZeros(sec, 2)
    );
    console.log(handleZeros(ms, 3));
  }

  function handleZeros(value, digit) {
    // This function deals with the proper display of stopwatch.
    // Although it is not a must, it is better to keep UI clean.
    // Our notation for stopwatch is: 00:00:00. However,
    // during counting, digits of time values are changing. To
    // overcome this, we check digits of time values every time
    // count function is called by setInterval method and we fix
    // digits by adding zeros to their beginnings until we achieve
    // the notation.
    var dummyZeros = "";
    for (i = 0; i < digit; i++) {
      dummyZeros += "0";
      return (dummyZeros + value).slice(-digit);
    }
  }
});
