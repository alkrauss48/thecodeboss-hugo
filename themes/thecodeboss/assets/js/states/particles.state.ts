import * as THREE from 'three';

const PARTICLE_GROUP_SETTINGS = [
  {
    color: { hue: 1, saturation: 1, lightness: 0.5 },
    size: 5,
  }, {
    color: { hue: 0.95, saturation: 1, lightness: 0.5 },
    size: 4,
  }, {
    color: { hue: 0.90, saturation: 1, lightness: 0.5 },
    size: 3,
  }, {
    color: { hue: 0.85, saturation: 1, lightness: 0.5 },
    size: 2,
  }, {
    color: { hue: 0.80, saturation: 1, lightness: 0.5 },
    size: 1,
  },
];

const _materials: THREE.PointsMaterial[] = [];
const particles: THREE.Points[] = [];

const setParticles = (): THREE.Points[] => {
  const basePoints = Array(20000)
    .fill(null)
    .map(() => new THREE.Vector3(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
    ));

  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(basePoints);

  for (let i = 0; i < PARTICLE_GROUP_SETTINGS.length; i += 1) {
    const { size } = PARTICLE_GROUP_SETTINGS[i];

    _materials[i] = new THREE.PointsMaterial({ size });

    const points = new THREE.Points(geometry, _materials[i]);

    points.rotation.x = Math.random() * 6;
    points.rotation.y = Math.random() * 6;
    points.rotation.z = Math.random() * 6;

    particles.push(points);
  }

  return particles;
};

const setPointsRotation = (points: THREE.Points, rotation: number) => {
  points.rotation.y = rotation;
};

const setMaterialColor = (delta: number) => {
  for (let i = 0; i < _materials.length; i += 1) {
    const { color } = PARTICLE_GROUP_SETTINGS[i];

    const hue = ((360 * (color.hue + delta)) % 360) / 360;
    _materials[i].color.setHSL(hue, color.saturation, color.lightness);
  }
};

export default {
  particles,
  setPointsRotation,
  setParticles,
  setMaterialColor,
}
