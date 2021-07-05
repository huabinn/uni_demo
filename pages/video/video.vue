<template>
    <view class="page-body">
        <div ref="div" style="color='blue'">1111111</div>
        <view class="page-section tc">
            <video 
                id="myVideo"
                class="video"
                src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" 
				poster-for-crawler=""
                @error="videoErrorCallback" 
                :danmu-list="danmuList"
                enable-danmu 
                danmu-btn 
                enable-play-gesture
                enable-auto-rotation
                @timeupdate="timeUpdata"
            ></video>
            <view style="margin: 30rpx auto" class="weui-label">弹幕内容</view>
            <input class="weui-input" v-model="inputValue" type="text" placeholder="在此处输入弹幕内容" />
            <button style="margin: 30rpx auto"  @click="bindSendDanmu" class="page-body-button" type="primary" formType="submit">发送弹幕</button>
            <navigator style="margin: 30rpx auto"  url="picture-in-picture" hover-class="other-navigator-hover">
            <button type="primary" class="page-body-button" @click="bindPlayVideo">小窗模式</button>
            </navigator>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                inputValue: '',
                src: '',
                danmuList:
                [{
                    text: '第 1s 出现的弹幕',
                    color: '#ff0000',
                    time: 1
                    }, {
                    text: '第 3s 出现的弹幕',
                    color: '#ff00ff',
                    time: 3
                }],
            }
        },
        onShareAppMessage() {
            return {
            title: 'video',
            path: 'page/component/pages/video/video'
            }
        },

        onReady() {
            this.videoContext = uni.createVideoContext('myVideo')
        },

        methods: {
            // 播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
            timeUpdata (event) {
                console.log(event);
            },
            getRandomColor() {
                const rgb = []
                for (let i = 0; i < 3; ++i) {
                    let color = Math.floor(Math.random() * 256).toString(16)
                    color = color.length === 1 ? '0' + color : color
                    rgb.push(color)
                }
                return '#' + rgb.join('')
            },

            bindInputBlur(e) {
                this.inputValue = e.detail.value
            },

            bindButtonTap() {
                const that = this
                uni.chooseVideo({
                sourceType: ['album', 'camera'],
                maxDuration: 60,
                camera: ['front', 'back'],
                success(res) {
                    that.setData({
                    src: res.tempFilePath
                    })
                }
                })
            },

            bindPlayVideo() {
                console.log(this.$refs.div);
            },
            bindSendDanmu() {
                this.videoContext.sendDanmu({
                    text: this.inputValue,
                    color: this.getRandomColor()
                })
                this.inputValue = ''
            },

            videoErrorCallback(e) {
                console.log('视频错误信息:')
                console.log(e.detail.errMsg)
            }
        }

    }
</script>

<style>
    .video {
        width: 100%;
        height: 480rpx;
    }
</style>
