<script lang="ts">
  import './global.css';
  import AceEditor from "./AceEditor.svelte";
  import ShaderPreview from "./ShaderPreview.svelte"; // ShaderPreviewをインポート
  import { uniforms } from '$lib/uniforms';

  let shaderCode = ''; // 編集されたコードを保持する変数
  let t;
  uniforms.subscribe((value)=>{
    t = value.time.value;
  });
  // AceEditorから編集されたコードを受け取るイベントハンドラを定義
  function handleShaderChange(event) {
    let newShaderCode = event.detail.text;
    shaderCode = newShaderCode;
  }
</script>
<p>{$uniforms.time.value}</p>
<AceEditor on:change="{handleShaderChange}" />
<ShaderPreview {shaderCode} />

<style>
</style>