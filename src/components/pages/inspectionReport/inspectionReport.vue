<template>
    <div id="inspectionReport">
        <div class="not-data">尚未接入检测数据</div>
    </div>
</template>

<script>
    export default {
        name: "inspectionReport"
    }
</script>

<style scoped lang="scss" >
  #inspectionReport{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .not-data{
      font-weight: 800;
      font-size: 40px;
      color: #e0e0e0;
    }
  }
</style>
