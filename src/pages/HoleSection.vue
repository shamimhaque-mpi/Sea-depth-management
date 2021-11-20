<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh;">
				<div class="custom-table-head">
					<h5>Hole Section</h5>
				</div>

				<hr style="margin-top: 2px">

				<div class="grid p-fluid">
					<div class="col-12 md:col-5">
						<span class="p-float-label">
							<MultiSelect id="multiselect" :options="visualizes" v-model="wells" optionLabel="name" :filter="true"></MultiSelect>
							<label for="multiselect">Select Wells From The List</label>
						</span>
					</div>

					<div class="col-2 md:col-2">
						<Button label="Show Data" @click="submit"></Button>
					</div>
				</div>

				<hr style="margin-top: 7px">

				<div class="demo-img" v-if="is_show">
					<img src="../assets/img/hole_info.webp">
					<img src="../assets/img/hole_graph.png">
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import axios from 'axios';
// import ChartService from '../service/ChartService';

export default {
	data() {
		return {
			visualizes : [],
			attributes : [],
			wells 	   : [],
			attribute  : [],
			depth_list : [],
			is_show:false,
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
	},
	methods:{
		submit:function(){
			if((this.wells).length > 0)
				this.is_show = true;
			else 
				this.is_show = false;
		}
	},
	watch:{
		
	}
}
</script>

<style scoped len="scss">
	.demo-img {
		display: flex;
	}
	.demo-img img:nth-child(1){
		width: 50%;
		height: fit-content;
	}
	.demo-img img:nth-child(2){
		width: 50%;
		height: fit-content;
	}
	.p-float-label input:focus ~ label, .p-float-label input.p-filled ~ label, .p-float-label textarea:focus ~ label, .p-float-label textarea.p-filled ~ label, .p-float-label .p-inputwrapper-focus ~ label, .p-float-label .p-inputwrapper-filled ~ label {
		top: -0.40rem;
	}
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
	}.row{
		display: flex;
	}
	.row .col-6 {
		width: 50%;
		border:  2px solid #ddd;
	}
	.row .col-6 + .col-6 {
		margin-left: -2px;

	}
	.row + .row {
		margin-top: -2px;
	}
</style>