<script lang="ts">
  import ace from "brace";
  import { onMount } from 'svelte';
  import "brace/mode/glsl";
  import "brace/theme/chrome";
  import { createEventDispatcher } from 'svelte';

  let editorContainer;
  let shaderCode = `
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

  const dispatch = createEventDispatcher();

  onMount(() => {
    const editor = ace.edit(editorContainer);
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/glsl");
    editor.setValue(shaderCode);
    editor.session.on('change', () => {
      shaderCode = editor.getValue();
      dispatch('change', {
        text: shaderCode
      }); // イベントを発火させます
    });

    editor.resize();
    dispatch('change',{
      text: shaderCode
    });
  });
</script>

<div class="ace" bind:this={editorContainer}></div>

<!-- todo:一定時間入力がなかったらイベント起こすようにする -->
<style>
 .ace {
    position: relative!important;
    border: 1px solid lightgray;
    margin: auto;
    height: 400px;
    width: 100%;
    background-color: rgba(255,255,255,0.5);
  }
</style>
