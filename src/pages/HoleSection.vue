<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh;">
				<div class="custom-table-head">
					<h5>Hole Section</h5>
				</div>
				<div class="grid p-fluid">
					<div class="col-12 md:col-5">
						<span class="p-float-label">
							<MultiSelect id="multiselect" :options="visualizes" v-model="wells" optionLabel="name" :filter="true"></MultiSelect>
							<label for="multiselect">Wells</label>
						</span>
					</div>

					<div class="col-12 md:col-5">
						<span class="p-float-label">
							<MultiSelect id="multiselect" :options="attributes" v-model="attribute" optionLabel="name" :filter="true"></MultiSelect>
							<label for="multiselect">Attribute</label>
						</span>
					</div>

					<div class="col-2 md:col-2">
						<Button label="Show Data" @click="submit"></Button>
					</div>
				</div>


				<div style="height: 90vh; overflow: auto;" v-if="depth_list && msg==''">
					<hr class="mt-2">
					<div id="chart" style="width: 100%;height:500px;"></div>
				</div>

				<div style="height: 62vh; overflow: auto;" v-if="msg!=''">
					<div style="height: 62vh; overflow: hidden; display: flex; justify-content: center; align-items: center;">
						<div>
							<span style="font-size:25px;color: rgb(153 153 153); display: block; text-align: center; margin-top: 5px">Loading...</span>
						</div>
					</div>
				</div>

				<div class="table-responsive">
					<table class="table table-bordered" v-for="(item, index) in depth_list" :key="index">
						<tr>
							<th>Well</th>
							<th>Attribute</th>
							<th>Depth__m</th>
							<th>East__m</th>
							<th>North__m</th>
							<th>SPPA__kPa</th>
							<th>TVD__m</th>
						</tr>
						<tr v-for="(row, index2) in item.data.Depth__m" :key="index2">
							<td>{{item.name}}</td>
							<td>{{item.attribute}}</td>
							<td>{{item.data.Depth__m[index2] ? item.data.Depth__m[index2] : ''}}</td>
							<td>{{item.data.East__m[index2] ? item.data.East__m[index2] : ''}}</td>
							<td>{{item.data.North__m[index2] ? item.data.North__m[index2] : ''}}</td>
							<td>{{item.data.SPPA__kPa[index2] ? item.data.SPPA__kPa[index2] : ''}}</td>
							<td>{{item.data.TVD__m[index2] ? item.data.TVD__m[index2] : ''}}</td>
						</tr>
					</table>
				</div>

			</div>
		</div>
	</div>
</template>


<script>
import axios from 'axios';
import ChartService from '../service/ChartService';

export default {
	data() {
		return {
			visualizes : [],
			attributes : [],
			wells 	   : [],
			attribute  : [],
			response   : '',
			depth_list : '',
			msg 	   : '',
		}
	},
	created() {
		//
	},
	mounted() {
		axios.get('http://drillbotics.ddns.net:4001/visualize/1/depth')
		.then(response=>{
			this.visualizes = response.data[0];
			this.attributes = response.data[1];
		});

		// axios.get('http://drillbotics.ddns.net:4001/design/1', [
		// 	this.wells, this.attribute, [[], []]
		// ])
		// .then(response=>{
		// 	this.depth_list = (response.data).traj;
		// 	console.log(this.depth_list);
		// 	ChartService.trajectoryMap((response.data).traj, 'chart');
		// });
	},
	methods:{
		submit:function(){
			this.depth_list = '';
			this.msg = 'Loading'
			axios.post('http://drillbotics.ddns.net:4001/design', [
				this.wells, this.attribute, [[], []]
			])
			.then(response=>{
				this.msg = '';
				this.depth_list = response.data.result;
				setTimeout(()=>{ChartService.trajectoryMap((response.data).result, 'chart');}, 100);
			});
		}
	}
}
</script>

<style scoped len="scss">
	.table {
		border-collapse: collapse;
	}
	.table tr td, .table tr th {
		padding: 5px;
		border:  1px solid #ddd;
		font-size: 15px;
	}
	.table tr:hover td {
		background: #ddd;
		cursor: pointer;
	}
	.custom-table-head {
		display: flex;
		justify-content: space-between;
	}
	.custom-table-head .p-button {
		height: fit-content;
		padding: 3px 14px;
	}
	.p-picklist-list {
		height: 195px!important;
	}
</style>