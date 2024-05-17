<script lang="ts">
  import './global.css';
  import AceEditor from "./AceEditor.svelte";
  import ShaderPreview from "./ShaderPreview.svelte"; // ShaderPreviewをインポート
  import { uniforms } from '$lib/uniforms';

</script>
<p>{$uniforms.time.value}</p>
<AceEditor/>
<ShaderPreview/>

<style>
</style>