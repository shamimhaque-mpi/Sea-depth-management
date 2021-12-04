<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<div class="custom-table-head">
					<h5 class="mt-2">Well Overview</h5>
				</div>
				<hr style="margin-top: 0;">
				
				<div style="height: 50vh; overflow: auto;">
					<table class="table">
						<thead>
							<tr>
								<th>Well Name</th>
								<th>Coordinate X</th>
								<th>Coordinate Y</th>
								<!-- <th>Water Depth</th>
								<th>Well Depth (MD/TVD)</th> -->
								<th width="110">Start Time</th>
								<th width="110">Complete  Time</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in visualizes" :key="row.id">
								<td>{{row.name}}</td>
								<td>{{row.Lat_UTM}}</td>
								<td>{{row.Lon_UTM}}</td>
								<!-- <td>{{row.inc_e}}</td>
								<td>{{row.inc_s}}</td> -->
								<td>{{dateReformat(row.start_index)}}</td>
								<td>{{dateReformat(row.end_index)}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="card">
				<div style="height: 60vh; overflow: auto;">
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
			visualizes: [],
			display: false,
		}
	},
	created() {
		//
	},
	mounted() {
		axios.get('http://drillbotics.ddns.net:4001/visualize/1/time')
		.then(response=>{
			this.visualizes = response.data[0];
			ChartService.location(this.visualizes, 'chart');
		});
	},
	methods:{
		dateReformat:function(date){
			return date.slice(0, 10);
		}
	}
}
</script>

<style scoped len="scss">
	.table {
		border-collapse: collapse;
		width: 100%;
	}
	.table tr td, .table tr th {
		padding: 5px;
		border:  1px solid #ddd;
		font-size: 15px;
		text-align: left!important;
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
</style>