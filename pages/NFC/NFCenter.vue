<template>
    <view>
        在此启动NFC，避免被手机拦截NFC
        <button @click="toNFC">去NFC</button>
    </view>
</template>

<script>
    export default {
        methods: {
            toNFC() {
                // 必须先打开NFC，不然NFC功能会被系统直接拦截，造成bug
                const NFCAdapter=wx.getNFCAdapter()
                NFCAdapter.startDiscovery({
                    success: res => {
                        console.log('启动NFC监听',res)
                        uni.redirectTo({
                            url: '/pages/NFC/NFC'
                        });
                    },
                    fail:err=>{
                        console.log('启动监听贴卡失败',err)
                        if(err.errCode==13021){
                            console.log('已经开始NFC扫描');
                            uni.redirectTo({
                                url: '/pages/NFC/NFC'
                            });
                        }else if(err.errCode==13001){
                            uni.showToast({
                                title:'请将您的手机NFC开启',
                                icon:'none',
                                duration:2000
                            })
                        }else{
                            uni.showToast({
                                title:'抱歉！您的手机暂不支持该功能',
                                icon:'none',
                                duration:2000
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style>
    
</style>
