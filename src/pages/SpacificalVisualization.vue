<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh;">
				<div class="custom-table-head">
					<h5>Spacific Visualization</h5>
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
						<div class="graph-collum" v-for="(attr, index2) in submited_attr" v-bind:key="index2" :ref="index+'view'+index2">
							<button class="action-btn open" @click="fullScreen(index+'view'+index2)">
								<svg viewBox="0 0 1000 1000" class="icon" height="1em" width="1em">
									<path d="m1000 350l-187 188 0-125-250 0 0 250 125 0-188 187-187-187 125 0 0-250-250 0 0 125-188-188 186-187 0 125 252 0 0-250-125 0 187-188 188 188-125 0 0 250 250 0 0-126 187 188z" transform="matrix(1 0 0 -1 0 850)"></path>
								</svg>
							</button>
							<button class="action-btn close" @click="fullScreen(index+'view'+index2)">&times;</button>

							<div style="height: 62vh; overflow: auto;" class="ttk_check">
								<div :id="((well.name).replaceAll('$', '_'))+'at'+(attr.unit).replaceAll('.', '_')+'_id_'+attr.id" style="width: 100%;height:400px;" class="ttk_check2">
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
						<div class="col-12 border sigle_colum" :ref="index+'view'">
							<button class="action-btn open" @click="fullScreen(index+'view')">
								<svg viewBox="0 0 1000 1000" class="icon" height="1em" width="1em">
									<path d="m1000 350l-187 188 0-125-250 0 0 250 125 0-188 187-187-187 125 0 0-250-250 0 0 125-188-188 186-187 0 125 252 0 0-250-125 0 187-188 188 188-125 0 0 250 250 0 0-126 187 188z" transform="matrix(1 0 0 -1 0 850)"></path>
								</svg>
							</button>
							<button class="action-btn close" @click="fullScreen(index+'view')">&times;</button>

							<div style="height: 62vh; overflow: auto;" class="ttk_check">
								<div :id="(attr.unit).replaceAll('.', '_')+'_id_'+attr.id" style="width: 100%;height:400px;" class="ttk_check2">
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
		axios.get('http://drillbotics.ddns.net:4001/visualize/1/depth')
		.then(response=>{
			this.visualizes = response.data[0];
			this.attributes = response.data[1];
		});
	},
	methods:{
		fullScreen:function(refs){
			if((this.$refs[refs]).classList.toggle('view')){
				window.document.querySelector('body').style.overflow = 'hidden';
			}
			else{
				window.document.querySelector('body').style.overflow = 'inherit';
				}
			this.generateGrap();
		},
		submit:function(){
			this.depth_list 	= [];
			this.submited_wells = [];
			this.submited_attr  = [];

			axios.post('http://drillbotics.ddns.net:4001/visualize/depth', [
				this.wells, this.attribute, [[], []]
			])
			.then(response=>{
				this.submited_wells = this.wells;
				this.submited_attr  = this.attribute;
				this.data_sanitization(response.data);
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
			setTimeout(()=>{ChartService.spacificVisualization(this.depth_list, this.attribute,  this.grid), 100});
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
		position: relative;
		transition: all .5s linear;
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



	/* for full screen */
	.sigle_colum {
		position: relative;
	}
	.graph-collum.view, .sigle_colum.view {
		position: fixed!important;
		top: 50%;
		left: 50%;
		z-index: 100010;
		background: #f8f9fa;
		width: 100%;
		height: 100vh;
		transform: translate(-50%, -50%);
	}
	.view .ttk_check2, .sigle_colum.view, .view .ttk_check {
		height: 100vh!important;
	}
	.graph-collum .action-btn, .sigle_colum .action-btn {
		position: absolute;
		top: 5px;
		left: 5px;
		width: 30px;
		height: 30px;
		background: #ddd;
		z-index: 995;
		border: 1px solid #00000012;
		background: #0000000a;
		cursor: pointer;
	}
	.sigle_colum {
		transition: all .5s linear;
	}

	.sigle_colum .open, .sigle_colum.view .close, .graph-collum .open, .graph-collum.view .close {
		display: block;
	}

	.sigle_colum.view .open, .sigle_colum .close, .graph-collum.view .open, .graph-collum .close {
		display: none;
	}
	.graph-collum .action-btn:hover {
		border: 1px solid #ff00474a;
	}
	.body-overflow {
		overflow: hidden!important;
	}

</style>