    let $container = d3.select('#scroll');
    let $graphic = d3.select('.scroll__graphic');
    let $chart = d3.select('.chart');
    let $text = d3.select('.scroll__text');
    let $step = $text.selectAll('.step');
    let center_layer;
    var info_state = L.control();
    var IconStyleOne = L.icon({
        iconUrl: './data/selected_icon.png'
    });
    var IconStyleTwo = L.icon({
        iconUrl: './data/all_icons.png'
    });
    



    var legend = L.control({position: 'bottomright'});
    let map = L.map('map', {zoomControl: false}).setView([41.9, 12.6], 6);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVmZmV2ZXJoYXJ0MzgzIiwiYSI6IjIwNzVlOTA3ODI2MTY0MjM3OTgxMTJlODgzNjg5MzM4In0.QA1GsfWZccIB8u0FbhJmRg', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.streets',
        opacity: 0.7,
        accessToken: 'pk.eyJ1IjoiamVmZmV2ZXJoYXJ0MzgzIiwiYSI6ImNqOXI2aDg5ejZhYncyd3M0bHd6cWYxc2oifQ.fzcb7maGkQhAxRZTotB4tg'
    }).addTo(map);

    
    map.scrollWheelZoom.disable();
    
    // initialize the scrollama
    
    // Scrollama 1
    var scroller = scrollama();
    
    // resize function to set dimensions on load and on page resize
    function handleResize() {
        // 1. update height of step elements for breathing room between steps
        var stepHeight = Math.floor(window.innerHeight * 0.15);
    
        $step.style('height', stepHeight + 'px');
    
        // 2. update height of graphic element
        var bodyWidth = d3.select('body').node().offsetWidth;
    
        // $graphic
        // .style('height', 100  + 'px');
    
        //window.innerHeight
    
        // 3. update width of chart by subtracting from text width
        var chartMargin = 32;
        var textWidth = $text.node().offsetWidth;
        // var chartWidth = $graphic.node().offsetWidth - textWidth - chartMargin;
        // make the height 1/2 of viewport
        var chartHeight = Math.floor(window.innerHeight);
        console.log(window.innerHeight)
        let $textarea = d3.select("#t1");
    
        $textarea.attr('style', `padding-top: ${chartHeight/2-100}px`);
        console.log(d3.select("textarea"))
        $chart
        // .style('width', chartWidth + 'px')
            .style('height', chartHeight * 0.95 + 'px');
    
        // 4. tell scrollama to update new element dimensions
        scroller.resize();
    }
    
    
    // scrollama event handlers
    function handleStepEnter(response) {
        // response = { element, direction, index }
        console.log("Step entering " + response.index)
    
        $step.classed('is-active', function (d, i) {
            return i === response.index;
        })
        console.log(response.index)
    
        // update graphic based on step
        if (response.index === 0) {
            console.log("Current Layer:", center_layer);
            center_layer.addTo(map);
            info.remove(map);
            map.flyTo([37.8, -100], 5);
        }
        if (response.index === 1) {
            map.removeLayer(center_layer);
            info.addTo(map);
            subset_layer.addTo(map);
            map.flyTo(pan_LatLng, 6);
        }
        if (response.index === 2) {
    
            map.removeLayer(subset_layer);
            info.remove(map);
            map.flyTo(pan_LatLng, 6);
        }
        if(response.index === 3){
            map.removeLayer(user_state_layer);
            georgia_layer.addTo(map);
            map.flyTo([32.1656, -82.9001], 6);
        }
        if(response.index === 4){
            map.removeLayer(georgia_layer);
            california_layer.addTo(map);
            map.flyTo([36.7783, -119.4179], 6);
        }
        if(response.index === 5){
            map.removeLayer(california_layer);
            alabama_layer.addTo(map);
            map.flyTo([32.3182,-86.9023], 6);
        }
        if(response.index === 6){
            map.removeLayer(alabama_layer);
            state_layer.addTo(map);
            info_state.addTo(map);
            legend.addTo(map);
            map.flyTo([37.8, -110], 4);
        }
    
        // if (response.index === 4){
        //     stop = false;
        // }
    }
    
    function handleStepExit(e){
        if(e.index==0){
            map.removeLayer(center_layer);
        }
        if(e.index==1){
            info.remove(map);
            map.removeLayer(subset_layer);
        }
        if(e.index==2){
            map.removeLayer(user_state_layer);
    
        }
        if(e.index==3){
            map.removeLayer(georgia_layer);
        }
        if(e.index==4){
            map.removeLayer(california_layer);
        }
        if(e.index==5){
            map.removeLayer(alabama_layer);
        }
        if(e.index==6){
            map.removeLayer(state_layer)
            info_state.remove(map);
            legend.remove(map);
        }
    
    }
    function init() {
        // 1. call a resize on load to update width/height/position of elements
        handleResize();
    
        // 2. setup the scrollama instance
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
            .setup({
                container: '#scroll', // our outermost scrollytelling element
                graphic: '.scroll__graphic', // the graphic
                text: '.box', // the step container
                step: '.scroll__text .box', // the step elements
                offset: 0.5, // set the trigger to be 1/2 way down screen
                debug: false, // display the trigger offset for testing
            })
    
            .onStepEnter(handleStepEnter)
    
            .onStepExit(handleStepExit)
            .onContainerEnter(handleContainerEnter)
            .onContainerExit(handleContainerExit);
    
        // setup resize event
        window.addEventListener('resize', handleResize);
    }
    
    // start it up
    init();

    function handleContainerEnter(response) {
        // response = { direction }
        console.log(response.index + "entering")
        // sticky the graphic
        $graphic.classed('is-fixed', true);
        $graphic.classed('is-bottom', false);
    }
    
    
    function handleContainerExit(response) {
    
        // if (response.index === 6){
        //     stop = true;
        // }
        // response = { direction }
        console.log(response.index + "exiting")
        // un-sticky the graphic, and pin to top/bottom of container
        // $graphic.classed('is-fixed', false);
        // $graphic.classed('is-bottom', response.direction === 'down');
    // }
    }
    
    
    // kick-off code to run once on load
    function init() {
        // 1. call a resize on load to update width/height/position of elements
        handleResize();
    
        // 2. setup the scrollama instance
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
            .setup({
                container: '#scroll', // our outermost scrollytelling element
                graphic: '.scroll__graphic', // the graphic
                text: '.box', // the step container
                step: '.scroll__text .box', // the step elements
                offset: 0.5, // set the trigger to be 1/2 way down screen
                debug: false, // display the trigger offset for testing
            })
    
            .onStepEnter(handleStepEnter)
    
            .onStepExit(handleStepExit)
            .onContainerEnter(handleContainerEnter)
            .onContainerExit(handleContainerExit);
    
        // setup resize event
        window.addEventListener('resize', handleResize);
    }
    
    // start it up
    init();
    
    let scroller2 = scrollama();
    init2();
    // Scrollama 2
    
    // Resize
    let stopAt100 = false;
    
    function init2() {
        // 1. call a resize on load to update width/height/position of elements
        handleResize2();
    
        // 2. setup the scrollama instance
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller2
            .setup({
                container: '#scroll', // our outermost scrollytelling element
                graphic: '.scroll__graphic', // the graphic
                text: '.scroll__text', // the step container
                step: '.scroll__text .boxvis3', // the step elements
                offset: 0.5, // set the trigger to be 1/2 way down screen
            })
    
            .onStepEnter(handleStepEnter2)
    
            .onStepExit(handleStepExit2)
            .onContainerEnter(handleContainerEnter2)
            .onContainerExit(handleContainerExit2);
    
        // setup resize event
        window.addEventListener('resize', handleResize2);
    }
    
    function handleStepEnter2(response) {
        // response = { element, direction, index }
    
        // fade in current step
        $step.classed('is-active', function (d, i) {
            console.log("vis3"+ response.index)
            return i === response.index;
        });
    
        if (response.index === 0) {
            // still stop
        } else if (response.index === 1){
            // move to 2017
    
            startYear = 2017;
            updateNumber(startYear);
            computePointsAndColor();
            stop=true;
    
        }  else if (response.index === 2){
            // change color
            // stop at 100
            stop = false;
            stopAt100 = true;
    
        }
        else if (response.index === 3){
            // Move pixels
            stopAt100 = false;
        }
        else if (response.index === 4){
            // move to 1995
            startYear = 1995;
            updateNumber(startYear);
            computePointsAndColor();
            stop=true;
            document.getElementById("main").className = "vis3part";
            document.getElementById("vis3_svg_container").className = 'vis3part';
            document.getElementById("vis3").className = "vis3_container";
            document.getElementById("pauseButton").className="pauseButtonClass disable";
        }
        else if (response.index === 5) {
            setTimeout(() => { stop=false}, 2);
            document.getElementById("main").className += ' zoomout';
            document.getElementById("vis3_svg_container").className += ' zoomout';
            document.getElementById("vis3").className += ' shiftleft';
            document.getElementById("pauseButton").className="pauseButtonClass";
        }
    }
    
    function handleStepExit2(response){
    
        console.log(response.index + "step exiting")
        // if (response.index === 5) {
        //     document.getElementById("main").className = "vis3part";
        //     document.getElementById("vis3_svg_container").className = 'vis3part';
        //     document.getElementById("vis3").className = "vis3_container";
        // }
    }
    
    function handleContainerEnter2(response) {
        console.log('container_enter2')
    }
    
    function handleContainerExit2(response) {
        console.log('container_exist2')
    }
    
    function handleResize2() {
        // 1. update height of step elements for breathing room between steps
        var stepHeight = Math.floor(window.innerHeight * 0.15);
    
        $step.style('height', stepHeight + 'px');
    
        // 2. update height of graphic element
        var bodyWidth = d3.select('body').node().offsetWidth;
    
        // $graphic
        // .style('height', 100  + 'px');
    
        //window.innerHeight
    
        // 3. update width of chart by subtracting from text width
        var chartMargin = 32;
        var textWidth = $text.node().offsetWidth;
        // var chartWidth = $graphic.node().offsetWidth - textWidth - chartMargin;
        // make the height 1/2 of viewport
        var chartHeight = Math.floor(window.innerHeight);
        console.log(window.innerHeight)
        let $textarea = d3.select("#t1");
    
        $textarea.attr('style', `padding-top: ${chartHeight/2-100}px`);
        console.log(d3.select("textarea"))
        $chart
        // .style('width', chartWidth + 'px')
            .style('height', chartHeight * 0.95 + 'px');
    
        // 4. tell scrollama to update new element dimensions
        scroller.resize();
    }
    
    
    
    
    
    
    
    /*
      Vis 1
    */
    
    let centerFeatures = [];

    let subset_layer;
    let state_layer;
    let pan_LatLng;
    let georgia_layer;
    let california_layer;
    let check_val=2010;
    let k=0;
    let check_value= 0;
    
    function style(feature) {
        return {
            fillColor: '#6baed6',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    
    let info = L.control({
        position : 'topright'
    });
    

    
    function padExtent(e, p) {
        if (p === undefined) p = 0.05;
        return ([e[0] - p, e[1] + p]);
    }
    
    
    d3.queue()
        .defer(d3.csv, './data/Viz1.csv', function(row) {
            let city = {
                name: row['Città'],  // Get city name
                region: row['Regione'] 
            };
            
            // Create a point for the city using latitude and longitude
            cityFeatures.push(turf.point([+row['Longitudine'], +row['Latitudine']], city));
            return city;
        })
        // .defer(d3.json,'./data/region1.json')
        // .defer(d3.json,'./data/shape_GA.geojson')
        // .defer(d3.json,'./data/shape_CA.geojson')
        // .defer(d3.json,'./data/shape_AL.geojson')
        // .defer(d3.csv, './data/2010-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2011-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2012-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2013-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2014-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2015-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2016-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2017-State-Bloodtype-BMI.csv')
        // .defer(d3.csv, './data/2018-State-Bloodtype-BMI.csv')
        .await(readyToDraw);
    
    let city_data = null;
    let zipcode_data = null;
    let region_data = null;
    let alabama_layer = null;
    let data_vis2 = null;
    let all_state = null;
    
    
    function readyToDraw(error, city,region) {
        if(error) {
            console.error('Error while loading datasets.');
            console.error(error);
            return;
        }
    
        city_data = city;
        region_data = region;
        let centerCollection = turf.featureCollection(centerFeatures);
        center_layer = L.geoJson(centerCollection);
        // georgia_layer = L.geoJson(georgia_data, {style:style});
        // california_layer = L.geoJson(california_data, {style:style});
        // alabama_layer = L.geoJson(albama_data,{style:style});
        all_region = region;
        updateMap('30318');
    
        let container = d3.select('#scroll');
        let graphic = container.select('.scroll__graphic');
        let text = container.select('.scroll__text');
        let step = text.selectAll('.step');
      
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML = props ? '<b></b>'
            : '<b>Click a center</b>';
        var ScatterPlotDiv = this._div.appendChild(document.createElement("div"));
        ScatterPlotDiv.className="scatterplot_box";
        var LineChartDiv = this._div.appendChild(document.createElement("div"));
        LineChartDiv.className="linechart_box";
    };
    
        var subsetFeatures =[];
        for (var i=0; i<subset_data.length;i++){
            var point_data = turf.point([subset_data[i].LatLng[1],subset_data[i].LatLng[0]], subset_data[i])
            subsetFeatures.push(point_data);
        }
        console.log(subset_data)
    
        var clickedMarker;
        var subsetCollection = turf.featureCollection(subsetFeatures);
        subset_layer = L.geoJson(subsetCollection);
        subset_layer.on('click', function (e) {
            info.update(e.layer.feature.properties)
            createScatterPlot(subset_data,e.layer.feature.properties);
            createLineChart(new_data,e.layer.feature.properties.center_name);
    
            if(clickedMarker) {
                clickedMarker.setIcon(IconStyleTwo);
            }
            var layer = e.layer;
            e.layer.setIcon(IconStyleOne);
            clickedMarker = e.layer;
        });
        /*subset_layer.on("mouseout",function(){
            //d3.select(".scatterplot").remove();
            info.update();
        });*/
        subset_layer.on('mouseover', function (e) {
            var point = map.latLngToContainerPoint(e.latlng);
            //console.log(point)
            var subset_tooltip = d3.select(map.getContainer())
                .append("div")
                .attr("class", "center_tooltip")
                // Calculating according to marker and tooltip size
                .style("left", point.x + 40 + "px")
                .style("top", point.y - 60+ "px")
                .style("position", "absolute")
                .style("background", "white")
                .style("opacity", "1")
                .style("padding", "0 10px")
                .style("z-index", "999")
                .style("filter", "url(#drop-shadow)")
                .html('<p><span style="color: gray;">CENTER NAME</span><br>'+e.layer.feature.properties.center_name+
                    '<br><span style="color: gray;">CITY</span><br>'+ e.layer.feature.properties.city+'<br><span style="color: gray;">COUNTY</span><br>'
                    +e.layer.feature.properties.county+'<br><span style="color: gray;">STATE</span><br>'+e.layer.feature.properties.state+'</p>')
                .node();
            //console.log(e.layer.feature.properties);
        });
        subset_layer.on('mouseout',function(e){
            //console.log("bye");
            d3.select(map.getContainer()).select(".center_tooltip").remove();
        });
    
    }
    info_state.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    
    info_state.update = function (props) {
        this._div.innerHTML = '<h4>Waitlist to Donor Ratio</h4>' +  (props ?
            '<b>' + props.NAME + '</b><br />' + props.value.slice(0,5) + ''
            : 'Hover over a state');
    };
    

