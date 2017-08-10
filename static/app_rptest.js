
  function rptest(){

    //console.log(gatherWorkspaceState());

    var hello_url = 'http://127.0.0.1:8080/rook-custom/rp-test';

    var postData = {nodeLength : allNodes.length};

    var request = $.ajax({
      url: hello_url,
      method: "POST",
      data: postData,
      dataType: "json"
    });

    request.done(function( resp_data ) {
      console.log(resp_data.message);

      Object.keys(resp_data.data).forEach(function(key) {
          console.log('[k: v] ' + key + ': ' + resp_data.data[key]);
      });

      //console.log(resp_data.data.node_length);
      //console.log(resp_data.data.num_clicks);
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });

    /*d3.json(hello_url, function(error, json) {
      console.log(json['message']);
    });
    */
  }

    //makeCorsRequest(urlcall,btn, downloadSuccess, downloadFail, solajsonout);


function logNodeNames(){

    // Log the number of attributes
    console.log(allNodes.length);

    // make an array of attribute names
    var attr_names = [];
    $.each(allNodes, function( index, node ) {
        attr_names.push(node.name);
        //console.log(index + ": " + node.name);
      });
    // log a list of attribute names
    console.log(attr_names.join(", "));
    // log the current date
    console.log(new Date().toLocaleString());


  }



  function gatherWorkspaceState() {

    console.log('zparams: ' + zparams);
    return;
      if (dataurl) {
  	zparams.zdataurl = dataurl;
      }

      if(production && zparams.zsessionid=="") {
          alert("Warning: Data download is not complete. Try again soon.");
          return;
      }

      zparams.zvars = [];
      zparams.zplot = [];

      var subsetEmpty = true;

      // is this the same as zPop()?
      for(var j =0; j < nodes.length; j++ ) { //populate zvars and zsubset arrays
          zparams.zvars.push(nodes[j].name);
          var temp = nodes[j].id;
          zparams.zsubset[j] = allNodes[temp].subsetrange;
          if(zparams.zsubset[j].length>0) {
              if(zparams.zsubset[j][0]!="") {
                  zparams.zsubset[j][0] = Number(zparams.zsubset[j][0]);
              }
              if(zparams.zsubset[j][1]!="") {
                  zparams.zsubset[j][1] = Number(zparams.zsubset[j][1]);
              }
          }
          zparams.zplot.push(allNodes[temp].plottype);
          if(zparams.zsubset[j][1] != "") {subsetEmpty=false;} //only need to check one
      }

      if(subsetEmpty==true) {
          alert("Warning: No new subset selected.");
          return;
      }

      var outtypes = [];
      for(var j=0; j < allNodes.length; j++) {
          outtypes.push({varnamesTypes:allNodes[j].name, nature:allNodes[j].nature, numchar:allNodes[j].numchar, binary:allNodes[j].binary, interval:allNodes[j].interval,time:allNodes[j].time});
      }

      var subsetstuff = {zdataurl:zparams.zdataurl, zvars:zparams.zvars, zsubset:zparams.zsubset, zsessionid:zparams.zsessionid, zplot:zparams.zplot, callHistory:callHistory, typeStuff:outtypes};

      var jsonout = JSON.stringify(subsetstuff);
      //var base = rappURL+"subsetapp?solaJSON="
      urlcall = rappURL+"subsetapp"; //base.concat(jsonout);
      var solajsonout = "solaJSON="+jsonout;

      console.log("POST out: ", solajsonout);


      function subsetSelectSuccess(btn,json) {
          console.log(json);
          selectLadda.stop(); // stop motion
          $("#btnVariables").trigger("click"); // programmatic clicks
          $("#btnModels").trigger("click");

          var grayOuts = [];

          var rCall = [];
          rCall[0] = json.call;


          // store contents of the pre-subset space
          zPop();
          var myNodes = jQuery.extend(true, [], allNodes);
          var myParams = jQuery.extend(true, {}, zparams);
          var myTrans = jQuery.extend(true, [], trans);
          var myForce = jQuery.extend(true, [], forcetoggle);
          var myPreprocess = jQuery.extend(true, {}, preprocess);
          var myLog = jQuery.extend(true, [], logArray);
          var myHistory = jQuery.extend(true, [], callHistory);

          spaces[myspace] = {"allNodes":myNodes, "zparams":myParams, "trans":myTrans, "force":myForce, "preprocess":myPreprocess, "logArray":myLog, "callHistory":myHistory};

          // remove pre-subset svg
          var selectMe = "#m".concat(myspace);
          d3.select(selectMe).attr('class', 'item');
          selectMe = "#whitespace".concat(myspace);
          d3.select(selectMe).remove();

         // selectMe = "navdot".concat(myspace);
         // var mynavdot = document.getElementById(selectMe);
         // mynavdot.removeAttribute("class");

          myspace = spaces.length;
          callHistory.push({func:"subset", zvars:jQuery.extend(true, [],zparams.zvars), zsubset:jQuery.extend(true, [],zparams.zsubset), zplot:jQuery.extend(true, [],zparams.zplot)});


        //  selectMe = "navdot".concat(myspace-1);
        //  mynavdot = document.getElementById(selectMe);

       //   var newnavdot = document.createElement("li");
       //   newnavdot.setAttribute("class", "active");
      //    selectMe = "navdot".concat(myspace);
      //    newnavdot.setAttribute("id", selectMe);
      //    mynavdot.parentNode.insertBefore(newnavdot, mynavdot.nextSibling);


          // this is to be used to gray out and remove listeners for variables that have been subsetted out of the data
          function varOut(v) {
              // if in nodes, remove
              // gray out in left panel
              // make unclickable in left panel
              for(var i=0; i < v.length; i++) {
                  var selectMe=v[i].replace(/\W/g, "_");
                  document.getElementById(selectMe).style.color=hexToRgba(grayColor);
                  selectMe = "p#".concat(selectMe);
                  d3.select(selectMe)
                  .on("click", null);
              }
          }

          logArray.push("subset: ".concat(rCall[0]));
          showLog();
          reWriteLog();

          d3.select("#innercarousel")
          .append('div')
          .attr('class', 'item active')
          .attr('id', function(){
                return "m".concat(myspace.toString());
                })
          .append('svg')
          .attr('id', 'whitespace');
          svg = d3.select("#whitespace");


          d3.json(json.url, function(error, json) {
                  if (error) return console.warn(error);
                  var jsondata = json;
                  var vars=jsondata["variables"];

                 // console.log(jsondata);
                  for(var key in jsondata["variables"]) {

                      var myIndex = findNodeIndex(key);
                  	//console.log("Key Value:"+key);
                  	//console.log("My index:"+myIndex);
                  	//console.log("Node Index"+findNodeIndex(key));
                      allNodes[myIndex].plotx=undefined;
                      allNodes[myIndex].ploty=undefined;
                      allNodes[myIndex].plotvalues=undefined;
                      allNodes[myIndex].plottype="";
                      //allNodes[myIndex].plotx=null;
                      //allNodes[myIndex].ploty=null;
                      //allNodes[myIndex].plotvalues=null;
                      //allNodes[myIndex].plottype="";

                      jQuery.extend(true, allNodes[myIndex], jsondata.variables[key]);
                      allNodes[myIndex].subsetplot=false;
                      allNodes[myIndex].subsetrange=["",""];
                      allNodes[myIndex].setxplot=false;
                      allNodes[myIndex].setxvals=["",""];

                      if(allNodes[myIndex].valid==0) {
                          grayOuts.push(allNodes[myIndex].name);
                          allNodes[myIndex].grayout=true;
                      }
                  }

                  rePlot();
                  populatePopover();
                  layout(v="add");

                  });
    //  console.log("vaalue of all nodes after subset:",allNodes);
          varOut(grayOuts);
      }


      function subsetSelectFail(btn) {
          selectLadda.stop(); //stop motion
      }

      selectLadda.start(); //start button motion
      makeCorsRequest(urlcall,btn, subsetSelectSuccess, subsetSelectFail, solajsonout);

  }
