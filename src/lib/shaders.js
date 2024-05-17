import { writable } from "svelte/store";
export const vertexShader = `
      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`;
export let fragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    void main() {
        // 時間に基づいて色を計算
        vec2 r=resolution,p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
        vec3 color = vec3(
            p.x + 0.5 * sin(time),
            p.y + 0.5 * cos(time),
            1.
        );

        gl_FragColor = vec4(color, 1.0);
    }
  `;
