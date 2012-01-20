var window_width = 6;
var window_height = 6;
var window_padding = 2;

// Return a string representing the given rgb values.
function rgbColor3f(r, g, b) {
  return "rgba(" + Math.round(r * 255) + ","
    + Math.round(g * 255) + ","
    + Math.round(b * 255) + ", 1)";
}

// Return a string representing the given rgba values.
function rgbaColor3f(r, g, b, a) {
  return "rgba(" + Math.round(r * 255) + ","
    + Math.round(g * 255) + ","
    + Math.round(b * 255) + "," + a + ")";
}

// Format a color based on a list of [r, g, b]
function rgbColor3fv(v) {
  return rgbColor3f(v[0], v[1], v[2]);
}

// Add some random amount of c2 into c1.
function randomContr(c1, c2, maxContr) {
  contr = Math.random() * maxContr;
  return _.map(_.zip(c1, c2), function(c) {
    return c[0] + contr * c[1];
  });
}

function draw() {
  document.body.appendChild(cityTexture(
        window.innerWidth, window.innerHeight));
}

function cityTexture(w, h) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', w + 'px');
  canvas.setAttribute('height', h + 'px');

  if (!canvas.getContext) {
    alert('Canvas not supported!');
    return;
  }
  var ctx = canvas.getContext('2d');

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
      var r = .12 * Math.random();
      var g = r;
      var b = r;

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

  // Draw window colors to screen
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

  // Shade the windows with a linear gradient
  for (var wj = 0; wj < windows_y; wj++) {
    var shade_gradient = ctx.createLinearGradient(
        0, wj * (window_height + window_padding) + window_padding,
        0, (wj + 1) * (window_height + window_padding));

    shade_gradient.addColorStop(0, rgbaColor3f(0, 0, 0, 0));
    shade_gradient.addColorStop(1, rgbaColor3f(0, 0, 0, .4));
    ctx.fillStyle = shade_gradient;

    for (var wi = 0; wi < windows_x; wi++) {
      ctx.fillRect(
          wi * (window_width + window_padding) + window_padding,
          wj * (window_height + window_padding) + window_padding,
          window_width,
          window_height);
    }
  }

  // Draw some bits in the windows that are on
  for (var wi = 0; wi < windows_x; wi++) {
    for (var wj = 0; wj < windows_y; wj++) {
      if (true || windows_on[wi][wj]) {
        while (Math.random() < .8) {
          ctx.fillStyle = rgbaColor3f(0, 0, 0, Math.random() * .6 + .3);

          var rect_height = Math.random() * Math.random() * window_height * .95;
          var rect_width = Math.random() * window_width * .8;
          var x_offset = Math.random() * (window_width - rect_width);
          var y_offset = window_height - rect_height;
          ctx.fillRect(
              wi * (window_width + window_padding) + window_padding + x_offset,
              wj * (window_height + window_padding) + window_padding + y_offset,
              rect_width,
              rect_height);
        }
      }
    }
  }

  return canvas;
}
