import * as THREE from 'three';

const PARAMETERS = [
  [ [1, 1, 0.5], 5 ],
  [ [0.95, 1, 0.5], 4 ],
  [ [0.90, 1, 0.5], 3 ],
  [ [0.85, 1, 0.5], 2 ],
  [ [0.80, 1, 0.5], 1 ]
];

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const materials = [];

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

export const init = () => {
  const container = document.getElementById('particles');

  camera.position.z = 1000;

  scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

  const points = [...Array(20000)].map((_, i) =>
    new THREE.Vector3(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
    )
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(points);

  for (let i = 0; i < PARAMETERS.length; i++) {
    const color = PARAMETERS[i][0];
    const size = PARAMETERS[i][1];

    materials[i] = new THREE.PointsMaterial({ size });

    const particles = new THREE.Points( geometry, materials[i] );

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add( particles );
  }

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
};

export const animate = () => {
  requestAnimationFrame( animate );
  render();
};

const onWindowResize = () => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const onDocumentMouseMove = (event) => {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
};

const render = () => {
  const time = Date.now() * 0.00005;

  camera.position.x += (mouseX - camera.position.x) * 0.01;
  camera.position.y += (-mouseY - camera.position.y) * 0.01;

  camera.lookAt( scene.position );

  for (let i = 0; i < scene.children.length; i ++) {
    const object = scene.children[ i ];

    if ( object instanceof THREE.Points ) {
      object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
    }
  }

  for (let i = 0; i < materials.length; i ++) {
    const color = PARAMETERS[i][0];

    const h = ( 360 * ( color[0] + time ) % 360 ) / 360;
    materials[i].color.setHSL( h, color[1], color[2] );
  }

  renderer.render( scene, camera );
};

export default {
  init,
  animate,
}
