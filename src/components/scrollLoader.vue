<template>
    <div id="scrollLoader-container" class="container-main">
        <div class="loading" v-if="topLoading">
            <div class="loader"></div>
        </div>

        <div :style="'min-height:' + realMinHeight + 'px; overflow-x:hidden'">
            <slot></slot>
        </div>

        <div class="loading" v-if="bottomLoading">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "scroll-loader",
        props: {
            'minHeight': {
                type: Number,
                default: 800
            }, 
                
        },
        created(){
        },
        computed: {
            realMinHeight(){
                return this.minHeight + 30
            }
        },
        data() {
            return {
               topLoading: false,
               bottomLoading: false,
               stopTopLoading: false, 
               stopBottomLoading: false,
            }
        },
        mounted(){
            this.listenScroll();
        },
        methods: {
            listenScroll(){
                var that = this;
                var topScroll = (stopTopLoading) => {
                    that.topLoading = false;
                    if(stopTopLoading) that.stopTopLoading = true;
                };

                var bottomScroll = (stopBottomLoading) => {
                    that.bottomLoading = false;
                    if(stopBottomLoading) that.stopBottomLoading = true;
                };
                setTimeout(function(){
                    var scrollContainer = document.getElementById('scrollLoader-container');

                    scrollContainer.onscroll = function(){

                        if(scrollContainer.scrollTop<=0 && !that.stopTopLoading){
                            if(that.topLoading) return;

                            that.topLoading = true;
                            that.$emit('upscroll', topScroll);
                        }
                        if((scrollContainer.offsetHeight + scrollContainer.scrollTop+1 >= scrollContainer.scrollHeight) && !that.stopBottomLoading){
                            if(that.bottomLoading) return;

                            that.bottomLoading = true;
                            scrollContainer.scrollTop += 40;
                            that.$emit('downscroll', bottomScroll);
                        }
                    }
                }, 50)
            },

        }
    }
</script>

<style scoped>
   .container-main {
        margin: 0 auto; 
        overflow: auto; 
        overflow-x: hidden; 
        padding: 0;
    }
   .loading{ 
        width: 100%; 
        height: 40px; 
        position: relative; 
        overflow: hidden; 
        text-align: center; 
        margin: 5px 0 ; 
        color: #999; 
        font-size: 13px;
    }
   .loader {
        font-size: 10px;
        margin: 8px auto;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #999;
        background: -moz-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
        background: -webkit-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
        background: -o-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
        background: -ms-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
        background: linear-gradient(to right, #999 10%, rgba(255, 255, 255, 0) 42%);
        position: relative;
        -webkit-animation: load3 1s infinite linear;
        animation: load3 1s infinite linear;
    }
    .loader:before {
        width: 50%;
        height: 50%;
        background: #999;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
    }
    .loader:after {
        background: #f5f5f5;
        width: 72%;
        height: 75%;
        border-radius: 68%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    @-webkit-keyframes load3 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
    }
    @keyframes load3 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
    }

</style>
