<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" style="min-height: 79vh; position: relative;">
				<div class="custom-table-head">
					<h5>Time Base Data Download</h5>
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
		axios.get('http://drillbotics.ddns.net:4001/visualize/1/time')
		.then(response=>{
			this.visualizes = response.data[0];
			this.attributes = response.data[1];
		});
	},
	methods:{
		download:function(){
			this.is_loading = true;
			axios.post('http://drillbotics.ddns.net:4001/visualize/time', [
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
						link.setAttribute("download", `${well.well_name+'-'+`(${well.well_att})`}.csv`);
						document.body.appendChild(link);
						link.click();
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