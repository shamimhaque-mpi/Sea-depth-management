<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh;">
				<div class="custom-table-head">
					<h5>Time Spacifical Visualization</h5>
					<Dropdown v-model="grid" :options="griding" optionLabel="name" placeholder="Select" />
				</div>
				<hr style="margin-top: 2px;">
				<div class="grid p-fluid">
					<div class="col-12 md:col-5">
						<span class="p-float-label">
							<MultiSelect id="multiselect" :options="visualizes" v-model="wells" optionLabel="name" :filter="true"></MultiSelect>
							<label for="multiselect">Select Wells From The List</label>
						</span>
					</div>

					<div class="col-12 md:col-5">
						<span class="p-float-label">
							<MultiSelect id="multiselect" :options="attributes" v-model="attribute" optionLabel="name" :filter="true"></MultiSelect>
							<label for="multiselect">Select Attribute From The List</label>
						</span>
					</div>

					<div class="col-2 md:col-2">
						<Button label="Show Data" @click="submit"></Button>
					</div>
				</div>

				<hr class="mt-2">

				<div v-if="grid.value=='single'">
					<div class="graph-row"  v-for="(well, index) in submited_wells" v-bind:key="index">
						<div class="graph-collum" v-for="(attr, index) in submited_attr" v-bind:key="index">
							<div style="height: 62vh; overflow: auto;">
								<div :id="((well.name).replaceAll('$', '_'))+'at'+(attr.unit).replaceAll('.', '_')+'_id_'+attr.id" style="width: 100%;height:400px;">
									<div style="height: 62vh; overflow: hidden; display: flex; justify-content: center; align-items: center;">
										<div>
											<span style="font-size: 60px; color: #d8d6d6;">¯\_(ツ)_/¯</span>
											<span style="color: rgb(153 153 153); display: block; text-align: center; margin-top: 17px">{{well.name}}</span>
											<span style="color: rgb(153 153 153); display: block; text-align: center; margin-top: 5px">{{attr.standard_name}}</span>
											<span style="color: rgb(153 153 153); display: block; text-align: center; margin-top: 5px">Data is not found</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="grid.value=='multiple'">
					<div class="row" v-for="(attr, index) in submited_attr" v-bind:key="index">
						<div class="col-12 border">
							<div style="height: 62vh; overflow: auto;">
								<div :id="(attr.unit).replaceAll('.', '_')+'_id_'+attr.id" style="width: 100%;height:400px;">
									<div style="height: 62vh; overflow: hidden; display: flex; justify-content: center; align-items: center;">
										<div>
											<span style="font-size: 60px; color: #d8d6d6;">¯\_(ツ)_/¯</span>
											<span style="color: rgb(153 153 153); display: block; text-align: center; margin-top: 5px">{{attr.standard_name}}</span>
											<span style="color: rgb(153 153 153); display: block; text-align: center; margin-top: 5px">Data is not found</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
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
			depth_list : [],
			griding: [
				{name:"Single", value:"single"},
				{name:"Multiple", value:"multiple"}
			],
			grid:{name:"Single", value:"single"},
			submited_wells: [],
			submited_attr: [],
		}
	},
	created() {
		//
	},
	mounted() {
		axios.get('http://drillbotics.ddns.net:4001/visualize/1/time')
		.then(response=>{
			this.visualizes = response.data[0];
			this.attributes = response.data[1];
		});
	},
	methods:{
		submit:function(){
			this.depth_list 	= [];
			this.submited_wells = [];
			this.submited_attr  = [];

			axios.post('http://drillbotics.ddns.net:4001/visualize/time', [
				this.wells, this.attribute, [[], []]
			])
			.then(response=>{
				this.submited_wells = this.wells;
				this.submited_attr  = this.attribute;
				this.data_sanitization(this.reformat(response.data));
			});
		},
		data_sanitization:function(depth_data)
		{
			/*
			* *************************
			* DEPTH DATA ORDERING
			* *************************
			*/
			// function depth_data_ordering(depth_data, i)
			function depth_data_ordering(depth_row)
			{
				return new Promise((resolve)=>{
					var data = {};
					(depth_row.data).forEach(item=>{
						for(var i in item){
							if(data[i]){
								(data[i]).push(item[i]);
							}else {
								data[i] = [item[i]];
							}
						}
					});
					resolve({"name":depth_row.name, "data":data});
				});
			}

			// STORE ALL PROMISED DATA
			var final_depth_list = [];
			//
			(depth_data).forEach((row)=>{
				final_depth_list.push(depth_data_ordering(row));
			});

			// FETCH ALL PROMISE DATA
			Promise.all(final_depth_list)
			.then(final_depth_list=>{
				this.depth_list = final_depth_list;
			})
			.catch(err=>console.log(err.message))
		},
		generateGrap:function(){
			setTimeout(()=>{ChartService.timeSpacificalVisualization(this.depth_list, this.attribute,  this.grid, true), 100});
		},
		reformat:function(data){
			var reformated_data = [];
			var check_well = [];

			Object.values(data).forEach(item=>{
				if(check_well.indexOf(item.well_name)<0){
					check_well.push(item.well_name);
					reformated_data.push({
						name:item.well_name,
						data:[]
					});
				}
			});

			Object.values(data).forEach(item=>{
				(reformated_data).forEach((well, key)=>{
					if(well.name && well.name==item.well_name){
						var old_array = reformated_data[key].data;
						reformated_data[key].data = old_array.concat(this.replaceKeyByattr(item));
					}
				});
			});

			return reformated_data;
		},
		replaceKeyByattr:function(data){
			var attr    = data.well_att;
			var packet = [];
			Object.values(data.data).forEach(item=>{
				packet.push({[attr]:item.mean_value, time:item.time});
			});
			return packet;
		}
	},
	watch:{
		depth_list:function(){
			this.generateGrap();
		},
		grid:function(){
			this.generateGrap();
		}
	}
}
</script>

<style scoped len="scss">
	.p-float-label input:focus ~ label, .p-float-label input.p-filled ~ label, .p-float-label textarea:focus ~ label, .p-float-label textarea.p-filled ~ label, .p-float-label .p-inputwrapper-focus ~ label, .p-float-label .p-inputwrapper-filled ~ label {
		top: -0.40rem;
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
	.graph-row {
		display: flex;
		width: 100%;
		overflow: hidden;
		overflow-x: auto;
	}
	.graph-row .graph-collum {
		min-width: 50%!important;
		border: 1px solid #ddd;
	}
	.graph-row .graph-collum + .graph-collum {
		margin-left: -1px;
	}
	.graph-row + .graph-row {
		margin-top: -1px;
	}
	.row{
		display: flex;
	}
	.row .col-6 {
		width: 50%;
		border:  2px solid #ddd;
	}
	.row .col-12 {
		width: 100%;
		border:  2px solid #ddd;
	}
	.row .col-6 + .col-6 {
		margin-left: -2px;

	}
	.row + .row {
		margin-top: -2px;
	}
</style>