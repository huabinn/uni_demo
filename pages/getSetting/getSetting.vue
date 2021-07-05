<template>
    <view>
        <button @click="getSetting">点击获取设置信息</button>
        <button @click="openSetting">打开设置</button>
    </view>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            // 获取设置信息
            getSetting () {
                uni.getSetting({
                    success(res) {
                        if (res.authSetting['scope.userLocation']) {
                            uni.showToast({
                                title: '已授权'
                            })
                        }
                        // 之前没有授权记录
                        if (!res.authSetting['scope.userLocation']) {
                            // 打开授权开关
                            uni.authorize({
                                scope: 'scope.userLocation',
                                success: () => {
                                    uni.showToast({
                                        title: '授权成功'
                                    })
                                },
                                fail: () => {
                                    console.log('失败');
                                    uni.showModal({
                                        title:'提示',
                                        content:'获取位置信息失败，请进入小程序设置重新授权',
                                        showCancel:false,
                                        confirmText:'知道了',
                                        success: (res) => {
                                            if(res.confirm){
                                                uni.openSetting({
                                                    success: (res) => {
                                                        if(res.authSetting['scope.userLocation']){
                                                            console.log('获取位置信息成功');
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
            // 打开设置
            openSetting () {
                uni.openSetting({
                    success (res) {
                        console.log(res.authSetting)
                        // res.authSetting = {
                        //   "scope.userInfo": true,
                        //   "scope.userLocation": true
                        // }
                    }
                })
            }
        }
    }
</script>

<style>
    
</style>
