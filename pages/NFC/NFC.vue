<template>
    <view>
        请打开NFC 并把卡贴在手机NFC区域
    </view>
</template>

<script>
    import {transceiveOrder,transceiveOrders} from "./index";
    export default {
        onShow() {
            const NFCAdapter=wx.getNFCAdapter()
            NFCAdapter.onDiscovered(res => {
				// 发现卡片并显示卡片支持的协议
                console.log("发现卡片", res);
                if (!res.techs.includes("ISO-DEP")) {
					uni.showToast({
						title: "抱歉！不支持此类卡片",
						icon: "none",
					});
					return;
				}
                console.log('NFCAdapter', NFCAdapter);
                // 根据协议号获取卡片信息
                const isoDep = NFCAdapter.getIsoDep()
                console.log('isoDep', isoDep);
                isoDep.connect({
					success: async (res) => {
                        console.log("连接成功", res);
						// 检查卡片的类型，根据不同类型的卡片获取使用不同的方法
                        this.checkCard(isoDep).then(res => {
                            console.log('卡片类型', res);
                            if (res == "commonCard") {
								// 读卡
								transceiveOrders(isoDep, ["00A4000002DDF1","00B0950808","00A4000002ADF3","805C000204",]).then((res) => {
									console.log("读卡", res);
									if (res.length == 4 && res[res.length - 1] != false) {
										const cardNo = res[1].slice(0, 16);
										const balance = parseInt(res[3].slice(0, -4), 16);
										console.log("卡号", cardNo, "余额", balance);
									} else {
										uni.showToast({
											title: "抱歉！读卡失败",
											icon: "none",
										});
									}
								});
							} else if (res == "isGbCard") {
								transceiveOrders(isoDep, ["00B0950000 ", "805C030204"]).then(
									(res) => {
										console.log("读卡", res);
										if (res[0] != false && res[0].slice(0, 8) != "02205810") {
											uni.showToast({
												title: "抱歉！暂不支持该发卡机构卡片",
												icon: "none",
											});
										} else if (res[res.length - 1] != false) {
											const cardNo = res[0].slice(24, 40);
											const balance = parseInt(res[1].slice(0, -4), 16);
											console.log("卡号", cardNo, "余额", balance);
										} else {
											uni.showToast({
												title: "抱歉！读卡失败",
												icon: "none",
											});
										}
									}
								);
							} else {
								uni.showToast({
									title: "抱歉！暂不支持此类卡片",
									icon: "none",
								});
							}
                        })
                    }
                })
            });
        },
        onHide() {
			const NFCAdapter = wx.getNFCAdapter();
			NFCAdapter.offDiscovered();
		},
        methods: {
            async checkCard(isoDep) {
				const arr = ["00A40400085041592E41505059","00A40400085943542E55534552","00A4040008A000000632010105"];
				for (var i = 0; i < 3; i++) {
					let {result} = await transceiveOrder(isoDep, arr[i]);
					if (result) {
						break;
					}
				}
				if (i == 0 || i == 1) {
					return "commonCard";
				} else if (i == 2) {
					return "isGbCard";
				} else {
					return false;
				}
			}
        }
    }
</script>

<style>
    
</style>
