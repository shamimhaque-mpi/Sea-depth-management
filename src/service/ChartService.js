var echarts = require('echarts');
import 'echarts-gl';

export default 
{
    location(data, dom_id) 
    {
        var graph = {
            "nodes"      : [],
            "links"      : [],
            "categories" : []
        };

        Object.values(data).forEach((row, key)=>{
            (graph.nodes).push({
                "id": key,
                "name": row.name,
                "symbolSize": 19.12381,
                "x":row.Lat_UTM,
                "y": row.Lon_UTM,
                "value": `(${row.Lat_UTM}°, ${row.Lon_UTM}°)`,
                "category": 0
            });

            (graph.links).push({
                "source": (++key),
                "target": "0"
            });
        });

        var chartDom = document.getElementById(dom_id);
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();

        var option = {

            title: {
                text: 'Geographical Map',
                subtext: 'Fetch From Drilling Database'
            },
            tooltip: {},
            series: [{
                name: 'Visualize',
                type: 'graph',
                layout: 'none',
                data: graph.nodes,
                categories: graph.categories,
                roam: true,
                label: {
                show: true,
                position: 'right',
                formatter: '{b}'
                },
                labelLayout: {
                hideOverlap: true
                },
                scaleLimit: {
                min: 0.4,
                max: 2
                },
                lineStyle: {
                color: 'source',
                curveness: 0.3
                }
            }]
        };
        myChart.setOption(option);
        return 1
    },


    statisticalVisualization:function(data, attribute, grid, time=false)
    {
        if(grid.value=='single'){
            Object.values(data).forEach((well)=>{
                var name = well.name;
                for(var attr in well.data){
                    var origin = attr;
                    attr = attr.replace('_dot_', '_');
                    if(attr!='Depth__m')
                    {
                        var dom_id        = (name.replaceAll('$', '_'))+'at'+(attr.slice(attr.lastIndexOf('__')+2));
                        var exist_unit    = (dom_id.slice(dom_id.lastIndexOf('at')+2, dom_id.lastIndexOf('_id'))).replaceAll('_', '.');
                        var standard_attr = ''; 

                        if(time){
                            dom_id     = (name.replaceAll('$', '_'))+'at'+(attr.slice(attr.indexOf('_')+1));
                            exist_unit = (dom_id.slice(dom_id.lastIndexOf('at')+2, dom_id.lastIndexOf('_id'))).replaceAll('_', '.');
                        }

                        // 
                        var node = document.querySelector('#'+dom_id);
                        if(node){
                            node.innerHTML = '';
                            // 
                            Object.values(attribute).forEach((standard_att)=>{
                                if(standard_att.unit==exist_unit){
                                    standard_attr = standard_att;
                                }
                            });

                            var option = [
                                {
                                    "x":well.data[origin].filter(x=>{if(x>0) return x}),
                                    "type": "histogram",
                                    "histnorm": "probability",
                                    "marker": {
                                        "color": "#5470c6"
                                    }
                                }
                            ];

                            console.log(option);

                            var layout  = {
                                bargap: 0.05,
                                bargroupgap: 0.2,
                                barmode: "overlay",
                                // height: 405,
                                // width: 648,
                                title: {text: name},
                                yaxis: {title: "Probability"},
                                xaxis: {title: standard_attr.standard_name},
                            };
                            window.Plotly.newPlot(dom_id, option, layout);
                        }
                    }
                }

            });

        }

        else if(grid.value=='multiple'){
            Object.values(attribute).forEach((attr)=>{
                var dom_id = (attr.unit).replaceAll('.', '_')+'_id_'+attr.id;

                var option = [];
                //
                Object.values(data).forEach(well=>{
                    for(var index in well.data){
                        if(dom_id==index.slice((index.lastIndexOf('__')+2)) || dom_id==index.slice((index.indexOf('_')+1))){
                            option.push({
                                "x"     : well.data[index].filter(x=>{if(x>0) return x}),
                                "name"  : well.name,
                                "type"  : "histogram",
                                "histnorm" : "probability",
                                "opacity"  : 0.5,
                            });

                        }
                    }
                });

                if(option.length > 0){
                    console.log(document.querySelector('#'+dom_id));
                    document.querySelector('#'+dom_id).innerHTML='';
                    var layout  = {
                        bargap: 0.05,
                        bargroupgap: 0.2,
                        barmode: "overlay",
                        // height: 405,
                        // width: 648,
                        title: {text: attr.standard_name},
                        yaxis: {title: "Probability"},
                        xaxis: {title: 'Normalized measurement %'},
                    };
                    window.Plotly.newPlot(dom_id, option, layout);
                }
            });
        }
    },

    timeSpacificalVisualization:function(data, attribute, grid, time=true)
    {
        if(grid.value=='single'){
            Object.values(data).forEach((well)=>{
                var name = well.name;
                var time_value = well.data.time;
                for(var attr in well.data){
                    attr = attr.replace('_dot_', '_');
                    if(attr!='time')
                    {
                        var dom_id        = (name.replaceAll('$', '_'))+'at'+(attr.slice(attr.lastIndexOf('__')+2));
                        var exist_unit    = (dom_id.slice(dom_id.lastIndexOf('at')+2, dom_id.lastIndexOf('_id'))).replaceAll('_', '.');
                        var standard_attr = '';
                        //
                        if(time)
                        {
                            dom_id     = (name.replaceAll('$', '_'))+'at'+(attr.slice(attr.indexOf('_')+1));
                            exist_unit = (dom_id.slice(dom_id.lastIndexOf('at')+2, dom_id.lastIndexOf('_id'))).replaceAll('_', '.');
                        }
                        //
                        var node = document.querySelector('#'+dom_id);
                        if(node)
                        {
                            node.innerHTML = '';
                            Object.values(attribute).forEach((standard_att)=>{
                                if(standard_att.unit==exist_unit){
                                    standard_attr = standard_att;
                                }
                            });
                            // 
                            var option = [
                                {
                                    type: 'scatter',
                                    mode: 'line',
                                    marker:{ size:3},
                                    x: this.data_shorting(time_value, 1000),
                                    y: this.data_shorting(well.data[attr], 1000),
                                }
                            ];
                            // 
                            var layout  = {
                                bargap: 0.05,
                                bargroupgap: 0.2,
                                barmode: "overlay",
                                // height: 405,
                                // width: 648,
                                title: {text: name},
                                yaxis: {title: standard_attr.standard_name},
                                xaxis: {
                                    autorange: true,
                                    type: 'date'
                                },
                            };
                            window.Plotly.newPlot(dom_id, option, layout);
                        }
                    }
                }

            });
        }

        else if(grid.value=='multiple'){
            Object.values(attribute).forEach((attr)=>{
                var dom_id = (attr.unit).replaceAll('.', '_')+'_id_'+attr.id;
                var option = [];
                //
                Object.values(data).forEach(well=>{
                    var time_value = well.data.time;
                    for(var index in well.data){
                        if(index!='time'){
                            if(dom_id==index.slice((index.lastIndexOf('__')+2)) || dom_id==index.slice((index.indexOf('_')+1))){
                                option.push({
                                    type: 'scatter',
                                    mode: 'line',
                                    marker:{size:3},
                                    x: this.data_shorting(time_value, 1000),
                                    y: this.data_shorting(well.data[attr], 1000),
                                });
                            }
                        }
                    }
                });

                console.log(option);

                if(option.length > 0){
                    document.querySelector('#'+dom_id).innerHTML='';
                    var layout  = {
                        bargap: 0.05,
                        bargroupgap: 0.2,
                        barmode: "overlay",
                        // height: 405,
                        // width: 648,
                        title: {text: name},
                        yaxis: {title: attr.standard_name},
                        xaxis: {
                            autorange: true,
                            type: 'date'
                        },
                    };
                    window.Plotly.newPlot(dom_id, option, layout);
                }
            });
        }
    },

    data_shorting:function(data, num){

        var len = (data ? data.length : 0), j, i, y;
        if(len<num+1) return data;
        if(len%num === 0 ){
            j = Math.floor(len/num);
        }  
        else{
            j = Math.floor(len/num) + 1;  
        }
        y = Math.floor(len/j);
        var new_array = [];
        for(i = 0; i < parseInt(y); i++){
            new_array.push(data[i * parseInt(j)]);
        }
        return new_array;
    },

    spacificVisualization:function(data, attribute, grid)
    {
        if(grid.value=='single'){

            Object.values(data).forEach((well)=>{
                var name        = well.name;
                var Depth__m    = well.data['Depth__m'];

                for(var attr in well.data){
                    if(attr!='Depth__m'){
                        var dom_id          = (name.replaceAll('$', '_'))+'at'+(attr.slice(attr.lastIndexOf('__')+2));
                        var exist_unit      = (dom_id.slice(dom_id.lastIndexOf('at')+2, dom_id.lastIndexOf('_id'))).replaceAll('_', '.');
                        var standard_attr   = '';
                        // 
                        var node = document.querySelector('#'+dom_id);
                        if(node){
                            node.innerHTML = '';
                            // 
                            Object.values(attribute).forEach((standard_att)=>{
                                if(standard_att.unit==exist_unit){
                                    standard_attr = standard_att;
                                }
                            });

                            var option = [
                                {
                                    x: this.data_shorting(well.data[attr], 1000),
                                    y: this.data_shorting(Depth__m.map(l => l* -1), 1000),
                            
                                    type:'scatter',
                                    mode:'markers',
                                    marker:{ size:3},
                                    hoverinfo:'skip'
                                }
                            ];

                            var layout  = {
                                title: data.name,
                                yaxis: {
                                    title: "Depth (m)"
                                },
                                xaxis: {
                                    title: standard_attr.standard_name,
                                }
                            };
                            window.Plotly.newPlot(dom_id, option, layout);
                        }
                    }
                }

            });

        }

        else if(grid.value=='multiple'){
            Object.values(attribute).forEach((attr)=>{
                attr;
                var dom_id = (attr.unit).replaceAll('.', '_')+'_id_'+attr.id;
                if(document.querySelector('#'+dom_id)){
                    var option = [];
                    //
                    Object.values(data).forEach(well=>{
                        var Depth__m = well.data['Depth__m'];
                        for(var index in well.data){
                            if(dom_id==index.slice((index.lastIndexOf('__')+2))){
                                option.push({
                                    name: well.name,
                                    x: this.data_shorting(well.data[index], 1000),
                                    y: this.data_shorting(Depth__m.map(l => l* -1), 1000),
                                    type:'scatter',
                                    mode:'markers',
                                    marker:{ size:3},
                                    hoverinfo:'skip'
                                });

                            }


                        }
                    });

                    if(option.length > 0){
                        document.querySelector('#'+dom_id).innerHTML = '';
                        var layout  = {
                            bargap: 0.05,
                            bargroupgap: 0.2,
                            barmode: "overlay",
                            // height: 405,
                            // width: 648,
                            title: {text: attr.standard_name},
                            yaxis: {title: "Probability"},
                            xaxis: {title: 'Normalized measurement %'},
                        };
                        window.Plotly.newPlot(dom_id, option, layout); 
                    }
                }

            });
        }
    },

    trajectoryMap:function(trajectories, dom_id){

        var series = [];
        var legend_data = [];
        for(var trajectory in trajectories){
            var data = [
                ['x', 'y', 'z', 'Category'],
            ];

            var noddle = trajectories[trajectory];

            legend_data.push(noddle.name);

            var map_data = {
                x:(noddle.traj_data ? noddle.traj_data.East__m : noddle.data.East__m),
                y:(noddle.traj_data ? noddle.traj_data.North__m : noddle.data.North__m),
                z:(noddle.traj_data ? noddle.traj_data.Depth__m.map((c) =>  c*-1) : noddle.data.Depth__m.map((c) =>  c*-1)),
            };

            if(map_data.x)
            for(var index in map_data.x){
                data.push([map_data.x[index], map_data.y[index], map_data.z[index], noddle.name]);
            }

            series.push({
                name: noddle.name,
                type: 'scatter3D',
                symbolSize: 1.8,
                datasetIndex:trajectory,
                encode: {
                    tooltip: [0, 1, 2, 3, 4]
                },
                dimensions: [
                    'East',
                    'North',
                    'Depth',
                    'Wells',
                ],
                data:data
            });
        }

        

        var chartDom = document.getElementById(dom_id);
        var myChart  = echarts.init(chartDom);

        myChart.hideLoading();
        var option = {
              legend: {
                data: legend_data,
                left: 'left'
              },
            tooltip: {},
            grid3D: {},
            xAxis3D: {
                type: 'category',
                name:'East',
                nameGap: 30
            },
            yAxis3D: {
                name:'North',
                nameGap: 30
            },
            zAxis3D: {
                name:'Depth',
                nameGap: 30
            },
            series: series
        };
        myChart.setOption(option);

        option && myChart.setOption(option);
    }

}
