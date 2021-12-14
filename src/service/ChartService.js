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

                            // DOWNLOAD PART
                            var download_data = [];
                            well.data[origin].map(x=>(x ? download_data.push([x]) : ''));
                            this.mkDownload(dom_id, download_data, `single-statistical-visualization(${name})`);
                        }
                    }
                }

            });

        }

        else if(grid.value=='multiple'){
            Object.values(attribute).forEach((attr)=>{
                var dom_id = (attr.unit).replaceAll('.', '_')+'_id_'+attr.id;

                var option        = [];
                var download_data = {};
                //
                Object.values(data).forEach(well=>{
                    for(var index in well.data){
                        if(dom_id==index.slice((index.lastIndexOf('__')+2)) || dom_id==index.slice((index.indexOf('_')+1))){
                            Object.assign(download_data, {[well.name]:well.data[index]});
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
                   

                    // DOWNLOAD PART
                    var csv = [];
                    csv.push(Object.keys(download_data));

                    var index = 0;
                    for(const row in download_data)
                    {
                        var i = 1;
                        (download_data[row]).forEach((value)=>{
                            var arr_data = [];
                            Object.values(download_data).forEach(niddle=>{arr_data.push('');niddle;});
                            if(index==0)
                            {
                                if(value){
                                    arr_data[index] = value;
                                    csv.push(arr_data);
                                }
                            }
                            else if(index > 0 && value)
                            {
                                if(csv[(i)]){
                                    csv[(i)][index] = value;
                                }
                                else {
                                    arr_data[index] = value;
                                    csv.push(arr_data);
                                }
                                i++;
                            }
                        });
                        index++; 
                    }
                    this.mkDownload(dom_id, csv, `Multiple-statistical-visualization(${attr.standard_name})`);
                    return 0;
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
                x:(noddle.traj_data ? noddle.traj_data.North__m : noddle.data.North__m),
                y:(noddle.traj_data ? noddle.traj_data.East__m : noddle.data.East__m),
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
                    'North',
                    'East',
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
                name:'North',
                nameGap: 30
            },
            yAxis3D: {
                name:'East',
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
    },

    mkDownload:function(id, data, file_name='download_csv'){
        var btn = document.createElement('button');
        btn.setAttribute('style', `
            position: absolute;
            top: 5px;
            left: 40px;
            width: 30px;
            height: 30px;
            background: #ddd;
            z-index: 995;
            border: 1px solid #00000012;
            background: #0000000a;
            cursor: pointer;
            padding:2px;
        `);
        btn.innerHTML = `
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAl0lEQVRIie3VIQ7CQBBG4Q9uUYVAYBAgUByfwCGaUIEgqSAcoYiyQJoG2qUVhP2TUZt5z+zM8E/Zo7rXrmvTpIegiumd9hBEJQmSYFxB4TlYzRnQeDvGyDe4NEBtdcU2RgBrlG/gJVax8JAFTi3wM5bfwkNmyF/gBeZDwUMyHNRbNRsanoL6Sn36813rcfHGWhVtk/+juQGi2j7/B36KCgAAAABJRU5ErkJggg=="/>
        `;
        btn.addEventListener('click', ()=>{
            // const rows = [
            //     ["name1", "city1", "some other info"],
            //     ["name2", "city2", "more info"]
            // ];
            
            let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${file_name}.csv`);
            document.body.appendChild(link);
            link.click()
        });

        var dom = window.document.querySelector(`#${id}`);
        dom.prepend(btn);
        data;
    },

}
