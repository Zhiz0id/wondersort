// adapted from http://bl.ocks.org/1582075
/***
 * d3 animation is here
 * return:
 *  function start(delay) - start of d3 animation
 *  function (sortingfunction, target)
 */
var SortingAnimation = function() {
    // Fisher–Yates shuffle
    // taken from http://bl.ocks.org/1582075
    function shuffle(array, actions) {
        var i = array.length, j, t;
        while (--i > 0) {
            j = ~~(Math.random() * (i + 1));
            t = array[j];
            array[j] = array[i];
            array[i] = t;
            if(actions) actions.push({type: "shuffle", i: i, j: j});
        }
        return array;
    }

    var ret = {};
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
    var n = 20;
    var index = d3.range(n);
    for (var digits=[],i=0;i<n;++i) digits[i]= Math.floor(Math.random()*100);
    digits.sort(
        function(a,b){
            return a - b;
        }
    );

    var metric = (digits[digits.length - 1] - digits[0]) / n;

    var x = d3.scale.ordinal().domain(index).rangePoints([0, width]),
        a = d3.scale.linear().domain([0, n - 1]).range([height / 5, height]);

    var colorRandomName = Object.keys(colorbrewer)[Math.floor(Math.random()*Object.keys(colorbrewer).length)];
    var color = d3.scale.quantize().domain([height / 10, height]).range(colorbrewer[colorRandomName][9]);
    var srcData = shuffle(index.slice());

    // digits, index, srcData public variables
    ret.digits = digits;
    ret.index = index;
    ret.srcData = srcData;

    var allActions = [];
    var lines = [];
    var infos = [];
    //var labels = [];
    // animationInProcess and done are public variables for state check
    ret.animationInProcess = false;
    ret.done = false;

    ret.start = function(delay) {
        setTimeout(

            function() {
                ret.interval = setInterval(function step() {
                    ret.animationInProcess = true;
                    for (var i = 0; i < allActions.length; i++) {
                        var action = allActions[i].actions.pop();
                        var line = lines[i];
                        var info = infos[i];
                        //var label = labels[i];

                        if (action) addComment(action.type, digits[action.a], digits[action.b]);

                        if (action) switch (action.type) {
                            case "partition":
                            {
                                info.style("stroke", function(d, i) {
                                    return i == action.pivot ? "red" : null;
                                });
                                info.style("opacity", function(d, i) {
                                    return i == action.pivot ? 1 : 0;
                                });
                                step();
                                break;
                            }
                            case "swap":
                            {
                                var t = line[0][action.i];
                                line[0][action.i] = line[0][action.j];
                                line[0][action.j] = t;

                                line.attr("transform", function(d, i) {
                                    return "translate(" + x(i) + ")";
                                });
                                line.style("stroke", function(d, i) {
                                    return color(a(d));
                                });

                                info.style("opacity", function(d, i) {
                                    return i == action.i || i == action.j ? 1 : 0;
                                });
                                info.style("stroke", function(d, i) {
                                    return color(a(d));
                                });

                                //var t = label[0][action.i];
                                //label[0][action.i] = label[0][action.j];
                                //label[0][action.j] = t;

                                // swap digits in ul/li fields
                                var from = $("#s" + (action.i+1));
                                var fromText = from.text();
                                var to = $("#s" + (action.i+2));
                                var toText = to.text();

                                to.text(fromText).effect( "bounce", "slow" );;
                                from.text(toText).effect( "bounce", "slow" );;

                                //label.attr("transform", function(d, i) {
                                //    return "rotate(90) translate(0 " + -x(i) + ")";
                                //});
                                break;
                            }
                            case "shuffle":
                            {
                                var t = line[0][action.i];
                                line[0][action.i] = line[0][action.j];
                                line[0][action.j] = t;
                                line.attr("transform", function(d, i) {
                                    return "translate(" + x(i) + ")";
                                });
                                line.style("stroke", function(d, i) {
                                    return color(a(d));
                                });

/*                                var t = label[0][action.i];
                                label[0][action.i] = label[0][action.j];
                                label[0][action.j] = t;
                                label.attr("transform", function(d, i) {
                                    return "rotate(90) translate(0 " + -x(i) + ")";
                                });*/
                                break;
                            }
                            case "miss":
                            {
                                info.style("opacity", function(d, i) {
                                    return i == action.miss ? 1 : 0;
                                });
                                info.style("stroke", function(d) {
                                    return "pink";
                                });
                                break;
                            }
                            case "traverse":
                            {
                                info.style("opacity", function(d, i) {
                                    return i == action.traverse ? 1 : 0;
                                });
                                info.style("stroke", function(d) {
                                    return "pink";
                                });
                                break;
                            }
                            case "done":
                            {
                                info.style("opacity", function(d, i) {
                                    ret.animationInProcess = false;
                                    ret.done = true;
                                    return 0;
                                });
                                break;
                            }
                        }
                    }
                }, 1000)
            }, delay);
    };

    ret.prepareAnimation = function(sortingfunction, target) {
        $(target + " svg").remove();
        var data = srcData.slice();
        var svg = d3.select(target).append("svg").attr("width", width + margin.left + margin.right);
        svg = svg.attr("height", height + margin.top + margin.bottom).append("g");
        svg = svg.attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");


        // line is line on sorting graphic
        var line = svg.selectAll("line").data(data).enter().append("line").attr("index", function(d, i) {
            return "i" + i;
        }).style("stroke", function(d) {
            return color(a(d));
        }).attr("x2", function(d) {
            return 0;
        }).attr("y2", function(d, i) {
            return -a(Math.floor(digits[d]/metric));
        }).attr("y1", function(d) {
            return 0;
        }).style("stroke-width", function(d) {
            return width / n;
        }).attr("transform", function(d, i) {
            return "translate(" + x(i) + ")";
        });


        // info - shows which line under sort
        var info = svg.selectAll("g").data(data).enter().append("svg:g").append("svg:line").attr("x1", function(d) {
            return 0;
        }).attr("y1", function(d) {
            return -height - 10;
        }).attr("x2", function(d) {
            return 0;
        }).attr("y2", function(d) {
            return -height - 5;
        }).style("stroke", function(d) {
            return "pink";
        }).style("opacity", function(d) {
            return 0;
        }).attr("transform", function(d, i) {

            // adds digits to li fields
            $("#s" + (i+1)).text(digits[d]);

            return "translate(" + x(i) + ")";
        }).style("stroke-width", function(d) {
            return width / n;
        });


        // label - digits under lines
        //var label = svg.selectAll("digits").data(data).enter().append("svg:g").attr("width", function(d) {
        //    return width / n;
        //}).append("svg:text").attr("x", function(d){
        //    return -15;
        //}).attr("y", function(d){
        //    return 0;
        //}).attr("transform", function(d, i){
        //    return "rotate(90) translate(0 " + -x(i) + ")";
        //}).text(function(d, i){
        //    // set digits to ui/li fields
        //    $("#s" + (i+1)).text(digits[d]);
        //    return ''; //digits[d];
        //});

        // sort the list, then reverse the stack of operations so we can animate chronologically from the start
        var actions = sortingfunction(data).reverse();

        // push our actions and reference to our lines to the animator
        allActions.push({
            actions: actions
        });

        lines.push(line);
        infos.push(info);
        //labels.push(label);
    };

    return ret;
}();