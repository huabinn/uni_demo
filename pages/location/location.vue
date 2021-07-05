<template>
    <view>
        <view class="page-body">
            <view class="page-section page-section-gap">
                <map style="width: 100%; height: 300px;" 
				id="map1"
				:latitude="latitude" 
				:longitude="longitude"
				show-compass
				show-location
				:markers="markers"
				@updated="loading"
				>
                </map>
            </view>
        </view>

		<view class="page-body">
			<view class="page-body-wrapper">
			<form bindsubmit="openLocation">
				<view class="page-body-form">
					<text class="page-body-form-key">距离</text>
					<input class="page-body-form-value" type="text" :value="distance + '米'" name="longitude" />
					<text class="page-body-form-key">当前经度</text>
					<input class="page-body-form-value" type="text" :value="longitude" name="longitude" />
					<text class="page-body-form-key">当前纬度</text>
					<input class="page-body-form-value" type="text" :value="latitude" name="latitude" />
					<text class="page-body-form-key">目标地址</text>
					<input class="page-body-form-value" type="text" :value="address" name="latitude" />
				</view>
				<view class="page-body-buttons">
				<button class="page-body-button" type="primary" @click="getLocation">获取位置</button>
				<button class="page-body-button" type="primary" @click="lookLocation">查看位置</button>
				<button class="page-body-button" type="primary" @click="chooseLocation">选择位置</button>
				<button class="page-body-button" type="primary" @click="guide">导航(到这去)</button>
				</view>
			</form>
			</view>
		</view>

    </view>
</template>

<script>
	export default {
		data() {
			return {
				key: 'PEKBZ-UI465-EEJIW-QV4WB-2RCY6-32FEK',
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				markers: [
					{
						id: 1,
						latitude: 23.13501,
						longitude: 113.2668,
						iconPath: '../../static/logo.png',
						width: 50,
						height: 50
					}
				],
				distance: 0,    //米
				latitude: 23.12901,           //纬度
				longitude: 113.2668,          //经度
				address: '',
				// 值为1开启导航, 0不开启
				navigation: '1',
				flag: false,        // 避免地图还没刷新完成时直接导航
			}
		},
		// 页面初次渲染完成
		onReady() {
			// 获取地图实例绑定到id为map1上
			this.mapCtx = uni.createMapContext('map1')
		},

		onLoad () {
			// 获取位置
			this.getLocation();
			this.currentDistance()
		},

		methods: {
			// 获取位置
			getLocation () {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						// console.log(this);
						this.longitude = res.longitude
						this.latitude = res.latitude

						if (this.mapCtx) {
							// 使用地图实例的方法,让标记点和我们都在可视范围内
							this.mapCtx.includePoints({
								padding: [80,50,80,50],
								points: [
									{
										longitude: this.longitude,
										latitude: this.latitude
									},
									{
										longitude: this.markers[0].longitude,
										latitude: this.markers[0].latitude
									}
								]
							})
						}
					}
				})
				// uni.getLocation({
				// 	type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				// 	success: function (res) {
				// 		const latitude = res.latitude;
				// 		const longitude = res.longitude;
				// 		that.longitude = res.longitude
				// 		that.latitude = res.latitude
				// 		uni.openLocation({
				// 			latitude: latitude,
				// 			longitude: longitude,
				// 			success: function () {
				// 				console.log('success');
				// 			}
				// 		});
				// 	}
				// });
			},
			// 地图刷新完成 
			loading () {
				this.flag = true
			},
			// 计算距离
			currentDistance () {
				// 详情参考 https://lbs.qq.com/service/webService/webServiceGuide/webServiceMatrix
				// https://apis.map.qq.com/ws/distance/v1/matrix/?mode=driving&from=39.984092,116.306934;40.007763,116.353798&to=39.981987,116.362896;39.949227,116.394310&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
				let url = 'https://apis.map.qq.com/ws/distance/v1/matrix/?mode=driving&from=' + this.latitude + ',' + this.longitude + '&to=' + this.markers[0].latitude + ',' + this.markers[0].longitude + '&key=' + this.key
				// console.log(url);
				uni.request({
					url: url,
					// 真机调试不能进入 success
					success: res => {
						// console.log(666);
						// console.log(res);
						this.distance = res.data.result.rows[0].elements[0].distance					
					},
					fail: err => {
						wx.showToast({
							title: '请求失败',
							icon: 'error',
							duration: 2000
						})
					}
				})
			},
			// 查看位置
			lookLocation () {
				const latitude = this.latitude;
				const longitude = this.longitude;
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function () {
						console.log('success');
					}
				});
			},
			// 选择位置
			chooseLocation () {
				const that = this
				uni.chooseLocation({
					success: function (res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						that.markers[0].longitude = res.longitude
						that.markers[0].latitude = res.latitude
						that.address = res.address
						that.currentDistance()
					}
				})
				
			},
			// 导航
			guide () {
				if (this.flag) {
					let plugin = requirePlugin('routePlan');
					let key = this.key;  //使用在腾讯位置服务申请的key
					let referer = 'location';   //调用插件的app的名称
					let endPoint = JSON.stringify({  //终点
					'name': this.address,
					'latitude': this.markers[0].latitude,
					'longitude': this.markers[0].longitude
					});
					uni.navigateTo({
						url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=' + this.navigation
					});
				}
			}
		}
	}
</script>

<style>
	.userinfo {
	display: flex;
	flex-direction: column;
	align-items: center;
	}

	.userinfo-avatar {
	width: 128rpx;
	height: 128rpx;
	margin: 20rpx;
	border-radius: 50%;
	}

	.userinfo-nickname {
	color: #aaa;
	}

	.usermotto {
	margin-top: 20px;
	}


	.wrapper{
	height: 100%;
	background:#fff;
	}
	.page-body-form-value{
	font-size: 14px;
	color:darkturquoise;
	font-weight: bold;
	padding-left: 15px;
	border: 1px solid rgb(72, 165, 131);
	border-radius: 4px;
	height: 30px;
	line-height: 30px;
	}
	.page-body-form-key{
	font-size:14px;
	padding: 10px;
	margin-top:15px;
	font-family: "Microsoft Yahei";
	font-weight: bold;
	height: 30px;
	line-height: 30px;
	}
	.page-body-button{
	margin-top:20px;
	line-height: 2;
	}
</style>
