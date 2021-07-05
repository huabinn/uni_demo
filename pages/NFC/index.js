export function hex2buffer(data) {
	//16进制字符串转ArrayBuffer
	return new Uint8Array(data.match(/[\da-f]{2}/gi).map(item => parseInt(item, 16))).buffer
}

export function string2buffer(str) {
	// 字符串转ArrayBuffer
	let val = ""
	for (let i = 0; i < str.length; i++) {
		if (val === '') {
			val = str.charCodeAt(i).toString(16)
		} else {
			val += ',' + str.charCodeAt(i).toString(16)
		}
	}
	return hex2buffer(val)
}

export function buffer2hex(ArrayBuffer) {
	//arraybuffer类型转16进制字符串
	return Array.prototype.map.call(new Uint8Array(ArrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

export function transceiveOrder(isoDep, order) {
	return new Promise((resolve, reject) => {
		isoDep.transceive({
			data: hex2buffer(order),
			success: res => {
				const result = buffer2hex(res.data)
				// console.log(result, result.slice(-4))
				if (result.slice(-4) != 9000) {
					resolve({
						result: false
					})
				} else {
					resolve({
						result
					})
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

export const transceiveOrders=async (isoDep, arr)=> {
	let array = []
	for (var i = 0; i < arr.length; i++) {
		let {result} = await transceiveOrder(isoDep, arr[i])
		if (result) {
			array.push(result)
		} else {
			array.push(false)
			break
		}
	}
	return array
}
