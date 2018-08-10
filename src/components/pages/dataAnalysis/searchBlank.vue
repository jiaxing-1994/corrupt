<template>

</template>

<script>
    export default {
        name: "searchBlank",
      data(){
          return{
            keyword:this.$route.query.keyword,
          }
      },
      mounted(){
          let _this = this;
        this.$router.push({
          path:'/home/searchResult',
          query:{keyword:_this.keyword.trim()}
        });
      },
      methods:{

      }

    }
</script>

<style scoped>

</style>
