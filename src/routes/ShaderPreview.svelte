<script>
  import * as THREE from 'three';
  import { onMount, onDestroy } from 'svelte';
  import { uniforms } from '$lib/uniforms';
  import { vertexShader , fragmentShader } from '$lib/shaders';
    
      
  let scene;
  let camera;
  let renderer;
  let mesh;
  const startTime = Date.now();
  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2,2);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader, // Vertex Shader
      fragmentShader: $fragmentShader, // Fragment Shader
      uniforms: uniforms
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    const animate = () => {
      requestAnimationFrame(animate);
      
      // 経過時間を計算
      const elapsedTime = (Date.now() - startTime) / 1000; // ミリ秒単位から秒単位に変換
      uniforms.update(value => {
        value.time.value = elapsedTime;
        return value;
      });
      mesh.material = new THREE.ShaderMaterial({
        vertexShader: vertexShader, // Vertex Shader
        fragmentShader: $fragmentShader, // Fragment Shader
        uniforms: $uniforms
      })
      renderer.render(scene, camera);
    };
    animate();
  });
  
  onDestroy(() => {
    renderer.dispose();
  });
</script>