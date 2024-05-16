<script lang="ts">
  import ace from "brace";
  import { onMount } from 'svelte';
  import "brace/mode/glsl";
  import "brace/theme/chrome";
  import { createEventDispatcher } from 'svelte';

  let editorContainer;
  let shaderCode = `
    uniform float time;
    void main() {
        // 時間に基づいて色を計算
        vec3 color = vec3(
            0.5 + 0.5 * sin(time),
            0.5 + 0.5 * cos(time),
            0.5 + 0.5 * tan(time)
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
  });
</script>

<div class="ace" bind:this={editorContainer}></div>

<style>
 .ace {
    position: relative!important;
    border: 1px solid lightgray;
    margin: auto;
    height: 400px;
    width: 100%;
  }
</style>