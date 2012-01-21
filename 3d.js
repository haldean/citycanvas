var drawBuildingWireframes = false;
var drawBuildingSolid = false;

var camera, scene, renderer, material, controls, stats;

window.onload = function(e) {
  init();
  animate();
}

function black() {
  return new THREE.MeshBasicMaterial({ color: 0x000000 });
}

function imageTexture(canvas) {
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.Texture(canvas)
  });
  material.map.needsUpdate = true;
  return material;
}

function building_cube(w, h) {
  if (drawBuildingWireframes) {
    return new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
  } else if (drawBuildingSolid) {
    return new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  }

  var on_color = [
    Math.random() * .3 + .7,
    0,
    Math.random() * .3 + .7];
  on_color[1] = on_color[2];

  var sides = [];
  for (var i = 0; i < 6; i++) {
    sides[i] = i == 2 || i == 3
      ? black() : imageTexture(cityTexture(w / 2, h / 2, on_color));
  }
  return sides;
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
      40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.x = 2048;
  camera.position.y = 512;
  camera.position.z = 2048;
  scene.add(camera);

  controls = new THREE.TrackballControls(camera);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  var buildings_generated = 0;
  var w_max = 256;
  var h_max = 512;
  var padding = 32;
  var blocks_per_side = 8;
  var block_offset = Math.floor(blocks_per_side / 2);

  for (var i = 0; i < blocks_per_side; i++) {
    for (var j = 0; j < blocks_per_side; j++) {
      while (Math.random() < .8) {
        buildings_generated++;
        var w = (Math.random() * .9 + .1) * w_max;
        var h = (Math.random() * .9 + .1) * h_max;
        if (Math.random() < .05) {
          h += h_max;
        }
        var geometry =
          new THREE.CubeGeometry(w, h, w, 1, 1, 1, building_cube(w, h));

        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
        var x = (w_max + padding) * (i - block_offset);
        var y = (w_max + padding) * (j - block_offset);

        mesh.position.set(
            x + (Math.random() - .5) * (w_max - w),
            (h_max - h) / -2,
            y + (Math.random() - .5) * (w_max - w));
        mesh.dynamic = true;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;

        scene.add(mesh);
      }
    }
  }
  console.log(buildings_generated + ' buildings generated.');

  var plane_side = (w_max + padding) * (blocks_per_side + 1) + padding;
  var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(plane_side, plane_side), 
      new THREE.MeshBasicMaterial({ color: 0x111111 }));
  plane.rotation.x = -Math.PI/2;
  plane.position.y = -h_max / 2;
  scene.add(plane);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

