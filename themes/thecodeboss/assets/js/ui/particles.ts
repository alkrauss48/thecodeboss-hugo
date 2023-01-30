import * as THREE from 'three';

import particlesState from '../states/particles.state';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const onDocumentMouseMove = (event: MouseEvent) => {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
};

const onWindowResize = () => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const render = () => {
  const delta = Date.now() * 0.00005;

  camera.position.x += (mouseX - camera.position.x) * 0.01;
  camera.position.y += (-mouseY - camera.position.y) * 0.01;

  camera.lookAt(scene.position);

  for (let i = 0; i < scene.children.length; i += 1) {
    const points = (scene.children[i] as THREE.Points);
    const rotation = delta * (i < 4 ? i + 1 : -(i + 1));

    particlesState.setPointsRotation(points, rotation);
  }

  particlesState.setMaterialColor(delta);

  renderer.render(scene, camera);
};

const init = () => {
  const container = document.getElementById('particles');

  if (!container) {
    return;
  }

  camera.position.z = 1000;

  scene.fog = new THREE.FogExp2(0x000000, 0.0007);

  particlesState.setParticles();
  particlesState.getParticles().forEach(particles => scene.add(particles));

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
};

const animate = () => {
  render();

  requestAnimationFrame(animate);
};

export default {
  init,
  animate,
};
