<script>
  import * as THREE from 'three';
  import { onMount, onDestroy } from 'svelte';
  import { uniforms } from '$lib/uniforms';
  import { vertexShader, fragmentShader } from '$lib/shaders';
  import { fetchFile, toBlobURL } from '@ffmpeg/util';
  import { FFmpeg } from '@ffmpeg/ffmpeg';
  import { Recorder } from './Recorder.js';
  


  let scene;
  let camera;
  let renderer;
  let mesh;
  let recorder;
  let isRecording = false;
  const startTime = Date.now();

  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    recorder = new Recorder(renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: $fragmentShader,
      uniforms: $uniforms,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = (Date.now() - startTime) / 1000;
      uniforms.update((value) => {
        value.time.value = elapsedTime;
        return value;
      });

      mesh.material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: $fragmentShader,
        uniforms: $uniforms,
      });
      
      renderer.render(scene, camera);
      recorder.captureFrame();
      
    };
    animate();
  });

  onDestroy(() => {
    renderer.dispose();
  });

  const startRecording = () => {
      recorder.start();
    };

  const stopRecording = async () => {
    await recorder.stop();
  };
</script>

<button on:click={startRecording}>Start Recording</button>
<button on:click={stopRecording}>Stop Recording</button>



