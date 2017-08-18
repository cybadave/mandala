/**
 * Created by davidlewis on 30/09/2016.
 */
var layers = [];
var repaintTimeout;

var mandalaOptions = function() {
    this.orbit = 2;
    this.appear = 2;
    this.disappear = 2;
    this.animateOrbit = true;
    this.animateAppear = true;
    this.animateDisappear = true;
    this.maxItemOpacity = 0.6;
    this.minItemOpacity = 0.1;
    this.maxLayers = 25;
    this.minLayers = 1;
    this.maxItems = 50;
    this.minItems = 1;
    this.colorScheme = 2;
    this.appear = 3;
    this.disappear = 3;
    this.backgroundColor = "#ffffff";
};
var opts = new mandalaOptions();

var max_layers = Math.floor(Math.random() * opts.maxLayers) + opts.minLayers;
var max_circles_per_layer = Math.floor(Math.random() * opts.maxItems) + opts.minItems;
var max_size = Math.floor(Math.random() * (window.innerHeight/2)) + 1;
var max_distance = Math.floor(Math.random() * window.innerHeight) + 1;
var max_opacity = opts.maxItemOpacity;
var max_explode = 2;

//todo - make regular polygon options
//todo - make implode/ exlode have 3 opts each
//todo - more colour options?
//todo - refactor out redundancies
//todo - click elements to pop!

var makeLayers = function(append){
    if(!append) {
        layers = [];
    }
    var layerCount = Math.floor(Math.random() * max_layers) + 5;
    for(var i = 0; i < layerCount; i++){
        var count = Math.floor(Math.random() * max_circles_per_layer) + 6;
        var distance = Math.floor(Math.random() * max_distance);
        var size = Math.floor(Math.random() * max_size);
        var opacity = (Math.random() * max_opacity) + opts.minItemOpacity;
        var explode = Math.floor(Math.random() * max_explode) +1;
        var implode = Math.floor(Math.random() * max_explode) +1;
        var color = Math.floor(Math.random() * max_explode) +1;
        var rotateDir = Math.floor(Math.random() * 2);
        if(opts.orbit == 0) rotateDir = 1;
        if(opts.orbit == 1) rotateDir = 0;
        var rotateSpeed = Math.floor(Math.random() * 5);
            layers.push({
            count:          count,
            distance:       distance,
            size:           size,
            opacity:        opacity,
            explode:        explode,
            implode:        implode,
            color:          color,
            rotateDir:      rotateDir,
            rotateSpeed:    rotateSpeed
        });
    }
    layers.sort(
        function(a,b){
            if (a.size !== b.size){
                return (a.opacity-b.opacity);
            } else {
                return (a.size-b.size);
            }
        });
};

var xPos = function(y, i, count){
    var theta = ((Math.PI * 2) / count) * i;
    return -(Math.sin(theta)* y);
};
var yPos = function(y, i, count){
    var theta = ((Math.PI * 2) / count) * i;
    return Math.cos(theta)* y;
};

var mandala = function(deltaA,deltaB){
    document.body.style.backgroundColor = opts.backgroundColor;
    document.getElementById('svg_canvas').setAttribute('width',window.innerWidth);
    document.getElementById('svg_canvas').setAttribute('height',window.innerHeight);
    document.getElementById('svg_canvas').setAttribute('viewbox',window.innerWidth/2 + ' ' +window.innerHeight/2 + ' '+window.innerWidth +' '+window.innerHeight);
    var gs = d3.select('svg')
                    .selectAll('g')
                    .data(layers);
    var circles = gs.enter()
                    .append('g')
                    .attr('class',function(d){
                        if(opts.animateOrbit) {
                            if (d.rotateDir > 0) {
                                return 'cw' + d.rotateSpeed;
                            } else {
                                return 'ccw' + d.rotateSpeed;
                            }
                        }else{
                            return '';
                        }
                    })
                    .selectAll('circle')
                    .data(function(d){ return new Array(d.count); });
    circles.enter()
        .append('circle')
        .attr('cx',function(d,i) {
            if(opts.animateAppear){
                return 0;
            }else{
                return xPos(d3.select(this.parentNode).datum().distance, i, d3.select(this.parentNode).datum().count);
            }
        })
        .attr('cy',function(d,i) {
            if(opts.animateAppear){
                return 0;
            }else{
                return yPos(d3.select(this.parentNode).datum().distance, i, d3.select(this.parentNode).datum().count);
            }
        })
        .attr('r',function(d){
            if(opts.animateAppear){
                return 0;
            }else{
                return d3.select(this.parentNode).datum().size;
            }
        })
        .attr('opacity',function(d){
            if(opts.animateAppear){
                return 0;
            }else{
                return d3.select(this.parentNode).datum().opacity;
            }
        })
        .transition()
        .attr('cx',function(d,i) { return xPos(d3.select(this.parentNode).datum().distance,i,d3.select(this.parentNode).datum().count);  })
        .attr('cy',function(d,i) { return yPos(d3.select(this.parentNode).datum().distance,i,d3.select(this.parentNode).datum().count); })
        .attr('r', function(d) { return d3.select(this.parentNode).datum().size; })
        .attr('fill',function(d,i) {
            if(d3.select(this.parentNode).datum().color > 1) {
                return d3.interpolateRainbow(d3.select(this.parentNode).datum().distance / max_distance)
            }else{
                return d3.interpolateRainbow(i / d3.select(this.parentNode).datum().count)
            }
        })
        .attr('stroke','black')
        .attr('opacity',function(d) { return d3.select(this.parentNode).datum().opacity})
        .duration(deltaA)
        .transition()
        .attr('r',function(d){
            if(opts.animateDisappear){
                return 0;
            }else{
                return d3.select(this.parentNode).datum().size;
            }
        })
        .attr('cx',function(d,i) {
            if(opts.animateDisappear){
                return 0;
            }else{
                return xPos(d3.select(this.parentNode).datum().distance, i, d3.select(this.parentNode).datum().count);
            }
        })
        .attr('cy',function(d,i) {
            if(opts.animateDisappear){
                return 0;
            }else{
                return yPos(d3.select(this.parentNode).datum().distance, i, d3.select(this.parentNode).datum().count);
            }
        })
        .attr('opacity',function(d){
            if(opts.animateDisappear){
                return 0;
            }else{
                return d3.select(this.parentNode).datum().opacity;
            }
        })
        .duration(deltaB);
    circles.exit()
        .remove();
    gs.exit()
          .remove();
};

makeLayers();

var clickDraw = function(){
    var deltaA = Math.floor(Math.random() * 10000) + 500;
    var deltaB = Math.floor(Math.random() * 10000) + 500;
    makeLayers(true);
    mandala(deltaA,deltaB);
    clearTimeout(repaintTimeout);
    repaintTimeout = setTimeout(redraw,deltaA+ deltaB);
};

var redraw = function(){
    var deltaA = Math.floor(Math.random() * 10000) + 500;
    var deltaB = Math.floor(Math.random() * 10000) + 500;
    layers = [];
    mandala(0,0);
    makeLayers();
    mandala(deltaA,deltaB);
    repaintTimeout = setTimeout(redraw,deltaA+ deltaB);
};

window.onresize = function() {
    redraw();
};



window.onload = function() {
    var gui = new dat.GUI();
    gui.closed = true;
    gui.remember(opts);
    var colorFolder = gui.addFolder('Color Settings');
    colorFolder.add(opts, 'backgroundColor');
    colorFolder.add(opts, 'colorScheme', { angular: 0, radial: 1, both: 2 });
    var animationFolder = gui.addFolder('Animation Settings');
    animationFolder.add(opts, 'animateOrbit');
    animationFolder.add(opts, 'orbit', { clockwise: 0, counterClockwise: 1, both: 2 });
    animationFolder.add(opts, 'animateAppear');
    //animationFolder.add(opts, 'appear', { inPlace: 0, explode: 1, implode: 2, all: 3 });
    animationFolder.add(opts, 'animateDisappear');
    //animationFolder.add(opts, 'disappear', { inPlace: 0, explode: 1, implode: 2, all: 3 });
    var mandalaFolder = gui.addFolder('Mandala Settings');
    mandalaFolder.add(opts, 'maxLayers',1,50);
    mandalaFolder.add(opts, 'minLayers',1,50);
    mandalaFolder.add(opts, 'maxItems',1,100);
    mandalaFolder.add(opts, 'minItems',1,100);
    mandalaFolder.add(opts, 'maxItemOpacity',0.1,1.0);
    mandalaFolder.add(opts, 'minItemOpacity',0.1,1.0);
};

