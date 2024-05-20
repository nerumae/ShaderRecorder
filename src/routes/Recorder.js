import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export class Recorder {
  constructor(renderer) {
    this.renderer = renderer;
    this.frames = [];
    this.recording = false;
    this.baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
  }

  async start() {
    this.frames = [];
    this.recording = true;
  }

  async stop() {
    this.recording = false;
    await this.encodeVideo(this.frames);
  }

  captureFrame() {
    if (this.recording) {
      this.frames.push(this.renderer.domElement.toDataURL());
    }
  }
  async encodeVideo(frames) {
    const ffmpeg = new FFmpeg();
    let message = "Loading ffmpeg-core.js";
    ffmpeg.on("log", ({ message: msg }) => {
      message = msg;
      console.log(message);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${this.baseURL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${this.baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${this.baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    // await ffmpeg.load();

    for (let i = 0; i < frames.length; i++) {
      ffmpeg.writeFile(`frame${i}.png`, await fetchFile(frames[i]));
    }

    // await ffmpeg.exec(['-r', '30', '-i', 'frame%d.png', 'output.mp4']);
    await ffmpeg.exec([
      "-framerate",
      "30",
      "-i",
      "frame%d.png",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(videoBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = videoUrl;
    downloadLink.download = "shader.mp4";
    downloadLink.click();

    // Clean up
    frames = [];
    ffmpeg.deleteFile("output.mp4");
    for (let i = 0; i < frames.length; i++) {
      ffmpeg.deleteFile(`frame${i}.png`);
    }
  }
}
