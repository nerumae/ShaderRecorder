<script>
  import * as THREE from 'three';
  import { onMount, onDestroy } from 'svelte';
  import { uniforms } from '$lib/uniforms';
  import { vertexShader, fragmentShader } from '$lib/shaders';
  import { fetchFile, toBlobURL } from '@ffmpeg/util';
  import { FFmpeg } from '@ffmpeg/ffmpeg';
  


  let scene;
  let camera;
  let renderer;
  let mesh;
  let recording = false;
  let frames = [];
  const startTime = Date.now();
  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';

  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    renderer = new THREE.WebGLRenderer({ antialias: true });

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

      if (recording) {
        frames.push(renderer.domElement.toDataURL());
      }
    };
    animate();
  });

  const startRecording = () => {
    frames = [];
    recording = true;
  };

  const stopRecording = async () => {
    recording = false;
    await encodeVideo(frames);
  };

  const dataURLToUint8Array = (dataURL) => {
    const binaryString = atob(dataURL.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encodeVideo = async (frames) => {
    const ffmpeg = new FFmpeg;
    let message = 'Loading ffmpeg-core.js';
    ffmpeg.on('log', ({ message: msg }) => {
			message = msg;
			console.log(message);
		});
    await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
		});
    // await ffmpeg.load();
    
    for (let i = 0; i < frames.length; i++) {
      const u8a = dataURLToUint8Array(frames[i])
      const fileName = `frame${i}.png`;
      // await ffmpeg.writeFile( `frame${i}.png`, u8a);
      ffmpeg.writeFile( `frame${i}.png`, await fetchFile(frames[i]));
      
      // if(i<10){
      //   const blob = new Blob([u8a], { type: 'image/png' });
      //   const url = URL.createObjectURL(blob);
      //   const downloadLink = document.createElement('a');
      //   downloadLink.href = url;
      //   downloadLink.download = fileName;
      //   downloadLink.click();
      // }
    }

    // await ffmpeg.exec(['-r', '30', '-i', 'frame%d.png', 'output.mp4']);
    await ffmpeg.exec(['-framerate', '30', '-i', 'frame%d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', 'output.mp4']);

    const data = await ffmpeg.readFile( 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = videoUrl;
    downloadLink.download = 'shader.mp4';
    downloadLink.click();

    // Clean up
    frames = [];
    ffmpeg.deleteFile('output.mp4');
    for (let i = 0; i < frames.length; i++) {
      ffmpeg.deleteFile( `frame${i}.png`);
    }
  };

  onDestroy(() => {
    renderer.dispose();
  });
</script>

<button on:click={startRecording}>Start Recording</button>
<button on:click={stopRecording}>Stop Recording</button>
