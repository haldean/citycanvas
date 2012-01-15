var window_width = 6;
var window_height = 10;
var window_padding = 3;

function rgbColor3f(r, g, b) {
  return "rgb(" + Math.round(r * 255) + ","
    + Math.round(g * 255) + ","
    + Math.round(b * 255) + ")";
}

function rgbColor3fv(v) {
  return rgbColor3f(v[0], v[1], v[2]);
}

function randomContr(c1, c2, maxContr) {
  contr = Math.random() * maxContr;
  return _.map(_.zip(c1, c2), function(c) {
    return c[0] + contr * c[1];
  });
}

function draw() {
  var canvas = document.getElementById('canvas');
  if (!canvas.getContext) {
    alert('Canvas not supported!');
    return;
  }

  var ctx = canvas.getContext('2d');
  var w = parseInt(canvas.getAttribute('width'));
  var h = parseInt(canvas.getAttribute('height'));

  ctx.fillStyle = "#000011";
  ctx.fillRect(0, 0, w, h);

  var windows_x = w / (window_width + window_padding);
  var windows_y = h / (window_height + window_padding);
  var windows = [];
  var windows_on = [];

  // Set which windows are on and off
  windows_on = _.map(_.range(windows_x), function(x) {
    return _.map(_.range(windows_y), function(y) {
      return Math.random() < .1;
    });
  });

  // Boost probability of window being on if it has neighbors that are on. Each
  // pass has a low probability of expansion, and we do a bunch of passes.
  for (var k = 0; k < 40; k++) {
    for (var wi = 0; wi < windows_x; wi++) {
      for (var wj = 0; wj < windows_y; wj++) {
        if (windows_on[wi][wj]) {
          if (wi - 1 > 0 && !windows_on[wi-1][wj]) {
            windows_on[wi-1][wj] = Math.random() < .01;
          }

          if (wi + 1 < windows_x && !windows_on[wi+1][wj]) {
            windows_on[wi+1][wj] = Math.random() < .01;
          }
        }
      }
    }
  }

  // Initial window colors
  for (var wi = 0; wi < windows_x; wi++) {
    windows[wi] = [];
    for (var wj = 0; wj < windows_y; wj++) {
      var r = .08;
      var g = .08;
      var b = .12;

      if (windows_on[wi][wj]) {
        if (wi > 0 && windows_on[wi-1][wj]) {
          r = windows[wi-1][wj][0];
          g = windows[wi-1][wj][1];
          b = windows[wi-1][wj][2];
        } else {
          r = .7 + Math.random() * .3;
          g = r;
          b = .7 + Math.random() * .3;
        }
      }

      windows[wi][wj] = [r, g, b];
    }
  }

  // Bleed colors from on windows to adjacent off windows
  for (var wi = 1; wi < windows_x - 1; wi++) {
    for (var wj = 0; wj < windows_y; wj++) {
      if (!windows_on[wi][wj] && Math.random() < .5) {
        if (windows_on[wi-1][wj]) {
          windows[wi][wj] = randomContr(windows[wi][wj], windows[wi-1][wj], .2);
        }

        if (windows_on[wi+1][wj]) {
          windows[wi][wj] = randomContr(windows[wi][wj], windows[wi+1][wj], .2);
        }
      }
    }
  }

  for (var wi = 0; wi < windows_x; wi++) {
    for (var wj = 0; wj < windows_y; wj++) {
      ctx.fillStyle = rgbColor3fv(windows[wi][wj]);
      ctx.fillRect(
          wi * (window_width + window_padding) + window_padding,
          wj * (window_height + window_padding) + window_padding,
          window_width,
          window_height);
    }
  }
}
