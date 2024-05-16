<script lang="ts">
  import * as THREE from 'three';
  import { onMount, onDestroy } from 'svelte';

  export let shaderCode = ``;
    
      
  let scene, camera, renderer, mesh;
  let uniforms = {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth,window.innerHeight)}
  };
  const startTime = Date.now();
  let vertexShader = `
      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`
    ;
  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2,2);
    mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
      vertexShader: vertexShader, // Vertex Shader
      fragmentShader: shaderCode, // Fragment Shader
      uniforms: uniforms
    }));
    scene.add(mesh);


    const animate = () => {
      requestAnimationFrame(animate);
      
      // 経過時間を計算
      const elapsedTime = (Date.now() - startTime) / 1000; // ミリ秒単位から秒単位に変換
      uniforms.time.value = elapsedTime;
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