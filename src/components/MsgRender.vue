/***
param:
    groupName       the name of this discussion
    memberCount     total count of member in this discussion
    ownerId         the id of owner
    systemId        system id
    types           types of messages,include text,image
    msgDatas        masseage object.The structure is as follows:
    [{
        id: 1,      //id for sorting message
        userId: 1,  // id of user who send this message
        type: types.text,   //type of this message,text or image
        content: '哎，敖丙出来一起玩啊', //message content:text or image url
        imgurl: require('../assets/nezha.jpg') //image of user who send this message
      },
      {
        id: 2,
        userId: 2,
        type: types.img,
        content: require('../assets/tjz.jpg'),
        imgurl: require('../assets/bingbing.jpg')
      }]

***/
<template>
    <div class="msgrender-container">
        <div class="window" id="window-container">
            <div class="title">
                <p v-text="groupName+'('+memberCount+')'"></p>
            </div>
            <!-- data is empty -->
            <div class="loading" v-if="msgDatas && msgDatas.length==0">
                <div style="margin-top: 300px;text-align:center; font-size: 16px;">
                    <span>未查找到聊天记录</span>
                </div>
            </div>
            <!-- main render-->
            <ScrollLoader :minHeight="minHeight" @upscroll="refresh" @downscroll="download" class="container-main" v-if="msgDatas && msgDatas.length>0" :style="{maxHeight: maxHeight-50 + 'px'}">
                <div class="message">
                    <ul>
                        <li v-for="(message, index) in msgDatas" :key="message.id" :class="message.userId==ownerId?'msg-right':'msg-left'">
                            <p class="system" v-if="message.userId==systemId"> <span v-html="message.content"></span> </p>
                            <div :class="'main' + (message.userId==ownerId?' self':'')" v-else>
                                <img class="avatar" width="45" height="45" :src="message.imgurl">
                                <!-- text -->
                                <div class="text" v-if="message.type==types.text">{{message.content}}</div>

                                <!-- img -->
                                <img :src="message.content" class="image" alt="images" v-else-if="message.type==types.img">
                            </div>
                        </li>
                        
                    </ul>
                </div>
            </ScrollLoader>

        </div>

    </div>
</template>

<script>
    import ScrollLoader from './scrollLoader.vue';
    var types={
        text: 1,
        img: 2
      }
    var msgDatas=[{
        id: 1,
        userId: 1,
        type: types.text,
        content: '哎，敖丙出来一起玩啊',
        imgurl: require('../assets/nezha.jpg')
      },
      {
        id: 2,
        userId: 2,
        type: types.img,
        content: require('../assets/tjz.jpg'),
        imgurl: require('../assets/bingbing.jpg')
      },
      {
        id: 3,
        userId: 1,
        type: types.img,
        content: require('../assets/zaza.jpg'),
        imgurl: require('../assets/nezha.jpg')
      },
      {
        id: 4,
        userId: 0,
        type: types.text,
        content: '殷十娘、李靖加入群聊'
      },
      {
        id: 5,
        userId: 3,
        type: types.text,
        content: '吒儿，开饭了',
        imgurl: require('../assets/za.jpeg')
      }]

    export default {
        name: "msgRender",
        components: {
            ScrollLoader
        },
        data() {
            return {
                groupName: '哪吒剧组',
                memberCount: 9,
                minHeight: 700,
                maxHeight: 700,
                isUpperLaoding: false,
                isUnderLaoding: false,
                isRefreshedAll: false,
                isDownLoadedAll: false,
                upperTimes: 0,
                underTimes: 0,
                upperId: 0,
                underId: 6,
                maxTimes: 5,
                ownerId: 1,
                systemId: 0,
                types:types,
                msgDatas: []
            }
        },

        created() {
            this.initData();
        },
        mounted(){
            this.minHeight = document.getElementById('window-container').offsetHeight;
            this.maxHeight = document.getElementById('window-container').offsetHeight;
        },

        methods: {
            initData(){
                this.msgDatas = this.msgDatas.concat(msgDatas);
            },

            //向上滚动加载数据
            getUpperData(){
              var that = this;
              return new Promise(function(resolve){
                setTimeout(function(){
                  if(that.upperTimes>that.maxTimes){
                    return resolve([]);
                  }
                  resolve([{
                      id: that.upperId-1,
                      userId: 0,
                      type: types.img,
                      content: '第 ' + that.upperTimes +' 次向上滚动！'
                    },
                    {
                      id: that.upperId-2,
                      userId: 1,
                      type: types.img,
                      content: require('../assets/zaza.jpg'),
                      imgurl: require('../assets/nezha.jpg')
                    },
                    {
                      id: that.upperId-3,
                      userId: 5,
                      type: types.text,
                      content: '哪吒破'+(20-that.upperTimes)+'亿啦！',
                      imgurl: require('../assets/bing.jpg')
                    }]
              
                  )
                }, 1000);
                that.upperId= that.upperId-3;
                that.upperTimes++;
              })
            },

            getUnderData(){
              var that = this;
              return new Promise(function(resolve){
                setTimeout(function(){
                  //模拟加载完毕
                  if(that.underTimes>that.maxTimes){
                    return resolve([]);
                  }
                  
                  //加载数据
                  resolve(
                    [{
                      id: that.underId+1,
                      userId: 0,
                      type: types.img,
                      content: '第 ' + that.underTimes +' 次向下滚动！'
                    },{
                      id: that.underId+2,
                      userId: that.underId+1,
                      type: types.text,
                      content: '吒儿，票房破'+(30+that.underTimes)+'亿啦',
                      imgurl: require('../assets/za.jpeg')
                    },
                    {
                      id: that.underId+3,
                      userId: that.underId+1,
                      type: types.text,
                      content: '加载第 ' + that.underTimes +' 条新信息！',
                      imgurl: require('../assets/bingbing.jpg')
                    }]
                  )
                }, 1000);

                that.underId = that.underId+3;
                that.underTimes++;
              })
            },

            //向上拉刷新
            refresh(done) {
                var that = this;
                if(that.isUpperLaoding){
                    return;
                }

                if(that.isRefreshedAll){
                    done(true);
                    that.isUpperLaoding = false;
                    return;
                }
                
                try {
                    this.getUpperData().then(function(data){
                        if(data.length==0){
                            that.isRefreshedAll = true;
                            done(true);
                        }else{
                            that.msgDatas = data.reverse().concat(that.msgDatas); //倒序合并
                            done();
                        }
                    })
                } catch (error) {
                    console.error('msRender: getUpperData error!')
                }
                that.isUpperLaoding = false;
            },

            //向下拉加载
            download(done) {
                var that = this;
                if(that.isUnderLaoding){
                    return;
                }
                if(that.isDownLoadedAll){
                    done(true);
                    that.isUnderLaoding = false;
                    return;
                }
                
                try {
                    this.getUnderData().then(function(data){
                        if(data == 0){
                            that.isDownLoadedAll = true;
                            done(true);
                        }else{
                            done();
                            that.msgDatas = that.msgDatas.concat(data); //concat msgdatas
                        }
                    })
                } catch (error) {
                    console.error('msgRender: getUnderData error!')
                }
                that.isUnderLaoding = false;
            }

        }
    }
</script>
<style scoped>
    .msgrender-container{ 
        width: 100%; 
        height: 100%;
        z-index: 100; 
        position: fixed; 
        left:0; 
        top: 0; 
        overflow: hidden;
        background-color: #efefef;
    }
    .shadow{ 
        position: absolute; 
        top:0; 
        left: 0; 
        z-index: 100; 
        width: 100%; 
        height: 100%; 
        background: #000; 
        opacity: .2; 
    }
    .window {
        box-shadow: 1px 1px 20px -5px #000; 
        max-height: 900px;
        width: 450px; 
        min-width: 300px; 
        background: #F5F5F5; 
        margin: 0 auto; 
        overflow: hidden; 
        padding: 0; 
        height: 100%;
        position: relative;
        z-index: 101;
    }
    .title{
        text-indent: 15px; 
        text-align:left;
        width: 100%; 
        height: 50px; 
        line-height: 50px; 
        font-size: 14px;
        border-bottom: 1px solid #d5d5d5;
    }
    .message{
        padding: 10px 15px;
        background-color: #F5F5F5;
    }
    .message li {
        margin-bottom: 15px;
        left:0;
        position: relative;
        display: block;
        text-align: left;
    }
    .message .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: calc(100% - 75px);
        min-height: 35px;
        line-height: 2.1;
        font-size: 15px;
        padding: 6px 10px;
        text-align: left;
        word-break: break-all;
        background-color: #fff;
        color: #000;
        border-radius: 4px;
        box-shadow: 0px 1px 7px -5px #000;
    }
    .message .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
        background: #fff;
    }
    .message .system {
        margin: 10px 0;
        text-align: center;
    }
    .message .system>span{
        display: inline-block;
        font-size: 12px;
        color: #999;
        border-radius: 2px;
        padding: 4px 9px;
        text-align: left;
    }
    .message .text:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #fff;
    }
    .message .self {
        text-align: right;
    }
    .message .self .avatar {
        float: right;
        margin: 0 0 0 10px;
    }
    .message .self .text {
        background-color: #9EEA6A;
    }

    .message .self .text:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #9EEA6A;
    }
    .message .image{
        max-width: 200px;
    }
    .msg-left{
        left: 0;
        animation: moveLeft .7s ease;
        -webkit-animation:moveLeft .7s ease; 
    }
    .msg-right{
        left: 0;
        animation: moveRight .7s ease;
        -webkit-animation:moveRight .7s ease; 
    }
    @keyframes moveRight{
        0%{left:-20px; opacity: 0};
        100%{left:0; opacity: 1}
    }

    @-webkit-keyframes moveRight
    {
        0%{left:-20px; opacity: 0};
        100%{left:0px; opacity: 1}
    }
    @keyframes moveLeft{
        0%{left:20px; opacity: 0};
        100%{left:0px; opacity: 1}
    }

    @-webkit-keyframes moveLeft
    {
        0%{left:20px; opacity: 0};
        100%{left:0px; opacity: 1}
    }
</style>