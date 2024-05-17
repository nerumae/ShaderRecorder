import { writable } from "svelte/store";
import * as THREE from "three";

export const uniforms = writable({
  time: { value: 0 },
  resolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
});
