<script lang="ts">
  import './global.css';
  import AceEditor from "./AceEditor.svelte";
  import ShaderPreview from "./ShaderPreview.svelte"; // ShaderPreviewをインポート
  let shaderCode = ''; // 編集されたコードを保持する変数

  // AceEditorから編集されたコードを受け取るイベントハンドラを定義
  function handleShaderChange(event) {
    let newShaderCode = event.detail.text;
    shaderCode = newShaderCode;
  }
</script>

<AceEditor on:change="{handleShaderChange}" />
<ShaderPreview {shaderCode} />

<style>
</style>