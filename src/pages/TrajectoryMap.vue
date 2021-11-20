<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh;">
				<div class="custom-table-head">
					<h5>Strajectory Map</h5>
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


				<div style="height: 62vh; overflow: auto;">
					<hr class="mt-2">
					<div id="chart" style="width: 100%;height:400px;"></div>
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
		}
	},
	created() {
		//
	},
	mounted() {
		axios.get('http://localhost:4000/visualize/1/depth')
		.then(response=>{
			this.visualizes = response.data[0];
			this.attributes = response.data[1];
		});

		axios.get('http://localhost:4000/design/1', [
			this.wells, this.attribute, [[], []]
		])
		.then(response=>{
			this.depth_list = (response.data).traj;
			console.log(this.depth_list);
			ChartService.trajectoryMap((response.data).traj, 'chart');
		});
	},
	methods:{
		submit:function(){
			axios.post('http://localhost:4000/design', [
				this.wells, this.attribute, [[], []]
			])
			.then(response=>{
				this.depth_list = response.data;

				console.log(response.data);

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