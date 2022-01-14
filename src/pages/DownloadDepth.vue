<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh;">
				<div class="custom-table-head">
					<h5>Depth Base Data Download</h5>
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
						<Button label="Loading..." v-if="is_loading" ></Button>
						<Button label="Download Data" @click="download" v-else ></Button>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>


<script>
import axios from 'axios';
export default {
	data() {
		return {
			visualizes : [],
			attributes : [],
			wells 	   : [],
			attribute  : [],
			is_loading : false,
		}
	},
	mounted() {
		axios.get('http://drillbotics.ddns.net:4001/visualize/1/depth')
		.then(res=>{
			this.visualizes = res.data[0];
			this.attributes = res.data[1];
		});
	},
	methods:{
		download:function(){
			this.is_loading = true;
			axios.post('http://drillbotics.ddns.net:4001/visualize/depth', [
				this.wells, this.attribute, [[], []]
			])
			.then(res=>{
				if(res.data != 'SQLITE_ERROR: incomplete input'){
					for(const index in res.data){
						var well = res.data[index];
						let csvContent = "data:text/csv;charset=utf-8," + this.mkRows(well.data).map(e => e.join(",")).join("\n");
						var encodedUri = encodeURI(csvContent);
						var link = document.createElement("a");
						link.setAttribute("href", encodedUri);
						link.setAttribute("download", `${well.name}.csv`);
						document.body.appendChild(link);
						link.click()
					}
				}
				else {
					alert(res.data);
				}
				this.is_loading = false;
			});
		},
		mkRows(data){
			var header = [], rows = [];

			if(data.length > 0){
				for(const index in data[0]){
					header.push(index);
				}

				rows.push(header);

				for(const key in data){
					rows.push(Object.values(data[key]));
				}
			}
			return rows;
		}
	},
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