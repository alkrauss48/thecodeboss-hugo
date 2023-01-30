import {beforeEach, describe, expect, test} from '@jest/globals';

import particlesState from '../assets/js/states/particles.state';

beforeEach(() => {
  particlesState.reset();
});

describe('reset', () => {
  test('removes all particles', () => {
    // Set the initial particles
    particlesState.setParticles();
    expect(particlesState.getParticles().length).not.toBe(0);

    // Make sure that `reset` clears them
    particlesState.reset();
    expect(particlesState.getParticles().length).toBe(0);
  });
});

describe('getParticles and setParticles', () => {
  test('gets and sets the particles', () => {
    expect(particlesState.getParticles().length).toBe(0);

    // Set the initial particles
    particlesState.setParticles();

    expect(particlesState.getParticles().length).not.toBe(0);
  });
});

describe('setPointsRotation', () => {
  test('sets the rotation on a single group of points', () => {
    const NEW_ROTATION = 6.789;

    // Set and get the initial particles.
    particlesState.setParticles();
    const particles = particlesState.getParticles();

    // Verify the rotation of the first particle group isn't already set.
    expect(particles[0].rotation.y).not.toBe(NEW_ROTATION);

    particlesState.setPointsRotation(particles[0], NEW_ROTATION);

    // Verify the rotation of the first particle group was changed.
    expect(particles[0].rotation.y).toBe(NEW_ROTATION);
  });
});

describe('setMaterialColor', () => {
  // setMaterialColor modifies a private _materials variable that doesn't get
  // exposed, so the best we can do is detect that no errors are thrown when
  // this function is called.

  test('can be called without any particles initialized', () => {
    expect(() => {
      particlesState.setMaterialColor(5);
    }).not.toThrowError();
  });

  test('can be called with particles initialized', () => {
    particlesState.setParticles();

    expect(() => {
      particlesState.setMaterialColor(5);
    }).not.toThrowError();
  });
});
