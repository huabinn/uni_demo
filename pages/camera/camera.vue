<template>
    <view>
        <camera id="mycamera" device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
        <button type="primary" @click="takePhoto">拍照</button>
        <view>预览</view>
        <image mode="widthFix" :src="src"></image>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                src: '',
                ctx: ''
            }
        },
        onLoad() {
            this.getSetting()
            this.ctx = uni.createCameraContext('mycamera');
            setTimeout(function () {
                console.log('start pulldown');
            }, 1000);
            uni.startPullDownRefresh();
        },
        onPullDownRefresh() {
            console.log('refresh');
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        methods: {
            takePhoto() {
                // const ctx = uni.createCameraContext();
                this.ctx.takePhoto({
                    quality: 'high',
                    success: (res) => {
                        this.src = res.tempImagePath
                    }
                });
            },
            error(e) {
                console.log(e.detail);
            },
            // 获取相机权限
            getSetting () {
                uni.getSetting({
                    success:(res) => {
                        if (res.authSetting['scope.camera']) {
                            uni.showToast({
                                title: '已授权'
                            })
                        }
                        // 之前没有授权记录
                        if (!res.authSetting['scope.camera']) {
                            // 打开授权开关
                            uni.authorize({
                                scope: 'scope.camera',
                                success: () => {
                                    uni.showToast({
                                        title: '授权成功'
                                    })
                                },
                                fail: () => {
                                    console.log('失败');
                                    uni.showModal({
                                        title:'提示',
                                        content:'获取相机权限失败，请进入小程序设置重新授权',
                                        success: (res) => {
                                            if(res.confirm){
                                                uni.openSetting({
                                                    success: (res) => {
                                                        if(res.authSetting['scope.camera']){
                                                            this.ctx.takePhoto()
                                                        }else{
                                                            uni.navigateBack()
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            },
        }
    }
</script>

<style>
    
</style>
