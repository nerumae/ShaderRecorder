<script lang="ts">
  import ace from "brace";
  import { onMount } from 'svelte';
  import "brace/mode/glsl";
  import "brace/theme/chrome";
  import { createEventDispatcher } from 'svelte';
  import { fragmentShader } from "$lib/shaders";

  let editorContainer;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const editor = ace.edit(editorContainer);
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/glsl");
    editor.setValue($fragmentShader);
    editor.session.on('change', () => {
      fragmentShader.set(editor.getValue());
    });

    editor.resize();
    dispatch('change',{
      text: $fragmentShader
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
