<script lang="ts">
  import * as THREE from 'three';
  import { onMount, onDestroy } from 'svelte';

  export let shaderCode = ``;
    
      
  let scene, camera, renderer, mesh;
  let uniforms = {
    time: { value: 0 }
  };
  let vertexShader = `
      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`
    ;
  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(600,400);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2,2);
    shaderCode = `uniform float time;
    void main() {
        // 時間に基づいて色を計算
        vec3 color = vec3(
            0.5 + 0.5 * sin(time),
            0.5 + 0.5 * cos(time),
            0.5 + 0.5 * tan(time)
        );

        gl_FragColor = vec4(color, 1.0);
    }`
    mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
      vertexShader: vertexShader, // Vertex Shader
      fragmentShader: shaderCode, // Fragment Shader
      uniforms: uniforms
    }));
    scene.add(mesh);


    const animate = () => {
      requestAnimationFrame(animate);
      
      uniforms.time.value += 0.01;
      mesh.material.uniforms.time.value = uniforms.time.value;
      mesh.material = new THREE.ShaderMaterial({
        vertexShader: vertexShader, // Vertex Shader
        fragmentShader: shaderCode, // Fragment Shader
        uniforms: uniforms
      })
      renderer.render(scene, camera);
    };
    animate();
  });

  onDestroy(() => {
    renderer.dispose();
  });
</script>