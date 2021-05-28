<template>
	<view class="index">
		<view class="tags">
			<block v-for="(value, index) in data" :key="index">
				<view class="tag" @tap="goList(value)">
					<image class="tag-img" :src="value.icon"></image>
					<text class="tag-text">{{value.type}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [
					{
						type: '萌宠',
						id: 15001,
						icon: 'http://placehold.it/150x150'
					},
					{
						type: '游戏',
						id: 12001,
						icon: 'http://placehold.it/150x150'
					},
					{
						type: '风景',
						id: 14001,
						icon: 'http://placehold.it/150x150'
					},
					{
						type: '美女',
						id: 11001,
						icon: 'http://placehold.it/150x150'
					},
					{
						type: '汽车',
						id: 16001,
						icon: 'http://placehold.it/150x150'
					},
					{
						type: '动漫',
						id: 13001,
						icon: 'http://placehold.it/150x150'
					}
				]
			}
		},
		methods: {
			goList(value) {
				uni.navigateTo({
					url:'../list/list?type=' + value.type + '&id=' + value.id
				})
			}
		}
	}
</script>

<style>
	
</style>
