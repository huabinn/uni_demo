<template>
    <view>
        <button @click="pay">支付</button>
    </view>
</template>

<script>
    export default {
        methods: {
            pay () {
                const timeStamp = Date.now().toString()
                console.log(timeStamp);
                wx.requestPayment
                (
                    {
                        "timeStamp": timeStamp,
                        "nonceStr": "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",     //随机字符串
                        "package": "prepay_id=wx201410272009395522657a690389285100",   //订单详情扩展字符串
                        "signType": "RSA",    //签名方式
                        // 签名
                        "paySign": "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==",
                        "success":function(res){
                            console.log('success');
                            console.log(res);
                        },
                        "fail":function(res){
                            console.log(res);
                        },
                        "complete":function(res){}
                    }
                )
            }
        }
    }
</script>

<style>
    
</style>
