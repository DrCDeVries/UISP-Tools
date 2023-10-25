"use strict"
import baseClientSide from "/uisptools/plugins/baseClientSide.js";
/*
* uisptools  1.0
* Copyright (c) 2022 Wilco Wireless
* Date: 2022-10-09
*/

/** 
@name uisptools.widget.channelmap
@class This is the detectdfs widget class for the UISPTools widget framework
@description We make a call to nms.devices/ap then for each device call the /devices/{id}/configuration /devices/airos/{id}/configuration and compare frequency to detect if device has changed channel due to dfs
*/


class channelmap extends baseClientSide.widget
 {
    
    self = null;
    
    loadTemplate(){
        return new Promise((resolve, reject) => {
            try{
                let $element = $(this.element);
                let url = this.widgetFactory.getWidgetFactoryFolder() + "/widgets/channelmap/channelmap.htm";
                $.uisptools.ajax({
                    method: 'GET',
                    url:  url,
                    dataType: 'html'
                }).then(
                    function (widgetHtml) {
                        $element.html(widgetHtml);
                        resolve();
                    },
                    function (err) {
                        $.logToConsole("Error: uisptools.loadWidget.onLoad.getWidgetHtml failed " + err);
                        reject(err);
                    }
                );
            }catch(ex){
                $.logToConsole("ERROR uisptools.loadWidget: " + ex.toString());
                reject(ex);
            }
        });
    }

    fetchApDevices(){
        return $.uisptools.ajax("/uisptools/api/nms/devices?role=ap");
    }
    fetchSimulation(){
        return $.uisptools.ajax("/uisptools/api/nms/simulation");
    }
    fetchSurvey(Deviceid){
        return $.uisptools.ajax("/uisptools/api/nms/devices/airmaxes/"+Deviceid+"/site-survey");
    }
    fetchStatistics(Deviceid){
        return $.uisptools.ajax("/uisptools/api/nms/devices/"+Deviceid+"/statistics?interval=hour");
    }
    fetchDeviceLocation(Deviceid){
        return $.uisptools.ajax("/uisptools/api/nms/devices/"+Deviceid+"/location");
    }
    fetchLinkDevice(Deviceid){
        return $.uisptools.ajax("/uisptools/api/nms/data-links/device/"+Deviceid);
        //return $.uisptools.ajax("/uisptools/api/nms/data-links/device/2dd1bc27-3f3e-4ac8-8ef7-229850630e47");
    }

    wifi5GhzChannelToFrequency(channel){
        return 5000 + (channel * 5)
    }

    sortDeviceByFrequency(a,b){
        let aFreq = a.overview.frequency;
        let bFreq = b.overview.frequency;
        if (aFreq < bFreq) {
            return -1;
          }
          if (aFreq > bFreq) {
            return 1;
          }
          // a must be equal to b
          return 0;
    }

    updateDeviceItem(options){
        let device = options.device;
        let $deviceItem = options.$deviceItem;
        $deviceItem.attr("data-deviceId", device.identification.id);
        $deviceItem.find(".deviceShow").find(".deviceCheckbox").attr("data-deviceIndex", options.index);
        $deviceItem.find(".deviceName").text(device.attributes.ssid);
        $deviceItem.find(".deviceModel").text(device.overview.antenna.name);
        $deviceItem.find(".deviceIpAddress").text(device.ipAddress);
        $deviceItem.find(".deviceType").text(device.overview.wirelessMode);


        if(device && device.overview.frequency){
            $deviceItem.find(".deviceFrequency").text(device.overview.frequency );
        }else{
            $deviceItem.find(".deviceFrequency").text("");
        }
        
        


        //Look for data in the DeviceConfig
        if (device.deviceConfig){  

            
            let currentFrequency = null;
            let configFrequency = null;
            if(device.overview && device.overview.frequency){
                currentFrequency = device.overview.frequency
            }
            switch(device.identification.type){
                case "airMax":
                    if(device.deviceConfig.airmax && device.deviceConfig.airmax.airmax && device.deviceConfig.airmax.airmax.frequency){
                        currentFrequency = device.deviceConfig.airmax.airmax.frequency;
                    }
                    if(device.deviceConfig.airmaxConfigWireless && device.deviceConfig.airmaxConfigWireless.controlFrequency ){
                        configFrequency = device.deviceConfig.airmaxConfigWireless.controlFrequency;
                    }
                case "airCube":
                    if(device.deviceConfig.aircube
                        && device.deviceConfig.aircube.aircube 
                        && device.deviceConfig.aircube.aircube.wifi5Ghz
                        && device.deviceConfig.aircube.aircube.wifi5Ghz.channel){
                            currentFrequency = this.wifi5GhzChannelToFrequency(device.deviceConfig.aircube.aircube.wifi5Ghz.channel);
                    }
                    if(device.deviceConfig.aircubeConfigWireless 
                        && device.deviceConfig.aircubeConfigWireless.wifi5Ghz 
                        && device.deviceConfig.aircubeConfigWireless.wifi5Ghz.channel){
                            configFrequency = this.wifi5GhzChannelToFrequency(device.deviceConfig.aircubeConfigWireless.wifi5Ghz.channel);
                    }
            }
            
            let displayFrequency = "";
            if(currentFrequency){
                displayFrequency = displayFrequency + currentFrequency;
            }
            if(configFrequency ){
                displayFrequency = displayFrequency + " (" + configFrequency + ")" ;
            }
            
            $deviceItem.find(".deviceFrequency").text(displayFrequency );
            
            //DFS Channel Change Detected
            if(currentFrequency && configFrequency                     
                && currentFrequency != configFrequency){
                    $deviceItem.find(".deviceFrequency").addClass('table-warning');
            }else{
                $deviceItem.find(".deviceFrequency").removeClass('table-warning');
            }
        }

    }

     bindDevices(devices){
        let map = this.map;
        let $element = $(self.element);
        let $deviceList = $element.find(".deviceList").empty();
        let $deviceHead = $element.find(".deviceHead")[0].firstElementChild.children;
        let $deviceMapList = $element.find(".deviceMapList").empty();
        let $barList = $element.find(".barList").empty();
        let $deviceItemTemplate = $element.find(".templates").find(".deviceTemplate").find(".deviceItem");
        let $deviceMapItemTemplate = $element.find(".templates").find(".deviceMapTemplate").find(".deviceMapItem");
        let $barTemplate = $element.find(".templates").find(".bar");
        let $frequencyChartTemplate = $element.find(".templates").find(".frequencyChartTemplate");
        const image = {
            url: "/images/devices/gpslite.png",
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(45, 55),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(22.5, 55),
          };



        let latlngbounds = new google.maps.LatLngBounds();

          let points = [];


        for(var i = 0; i < devices.length; i++){

            
            let device = devices[i];

            if(device.location.latitude&&device.location.longitude){

                points.push({ y: device.location.latitude, x: device.location.longitude });
                  const deviceMarker = new google.maps.Marker({
                    position: { lat: device.location.latitude, lng: device.location.longitude },
                    map,
                    icon: image,
                    title: device.attributes.ssid + " " + device.overview.frequency
                });
                latlngbounds.extend(new google.maps.LatLng(device.location.latitude, device.location.longitude))
                let $deviceItem = $deviceItemTemplate.clone();
                let $deviceMapItem = $deviceMapItemTemplate.clone();
                this.updateDeviceItem({device:device, $deviceItem: $deviceItem});
                this.updateDeviceItem({device:device, $deviceItem: $deviceMapItem});
                let $deviceCheckboxTemplate = $deviceItem.find(".deviceShow").find(".deviceCheckbox");
                $deviceCheckboxTemplate.on('click', function(event) {
                    

                    const $button = $(this);
                    var test = false;
                    console.log(device.location.heading);
                    if (event.target.checked && device.location.heading != null ) {
                        $button.data("link", addPolygon(device));

                        Promise.all([self.fetchStatistics(device.identification.id)]).then(
                            (results) => {
                                let deviceS = results[0];
                                let frequencyBands = deviceS.frequency.frequencyBands;
                                console.log(deviceS);

                                if(frequencyBands == null){
                                    console.log("No Band");
                                    return;
                                }else{console.log("Band");}
                                let $frequencyChart = $frequencyChartTemplate.clone();
                                 $frequencyChart.find(".name").text("SSID: "+device.attributes.ssid);
                                 $frequencyChart.find(".frequency").text("Frequency: "+deviceS.frequency.frequencyCenter);
                                 $frequencyChart.find(".channelWidth").text("Channel Width: "+deviceS.frequency.channelWidth);
                                let $barContainer = $frequencyChart.find(".barContainer");
                                for(var i = 0; i < frequencyBands.length; i++){
                                    let frequencyBand = frequencyBands[i];
                                    let interference = frequencyBand[1];
                                    let $bar = $barTemplate.clone();
                                    $bar.attr("style", `  background-color: ${calculateColor(interference)};`);
                                    // let $tooltipContainer = document.createElement("span");
                                    //     $tooltipContainer.classList="tooltiptext";
                                    //     $tooltipContainer.textContent = `Frequency / Noise`;
                                        //$tooltipContainer.classList="tooltip custom-tooltip";
                                        // let $tooltipHeader = document.createElement("span");
                                        // let $tooltip = document.createElement("span");
                                        // $tooltipHeader.textContent = `Frequency / Noise `;
                                        // $tooltip.textContent = `${frequencyBand[0]} "MHz / ${frequencyBand[1]*2-125} dBm`;
                                        // $tooltip.classList="tooltip custom-tooltip";
                                        // $tooltipContainer.append($tooltipHeader);
                                        // $tooltipContainer.append($tooltip);

                                        //$bar.append($tooltipContainer);
                                    $barContainer.append($bar);

                                    function calculateColor(value) {
                                        var red = 0;
                                        var green = 0;
                                        var blue = 0;
                                        if(value>15){
                                         red = Math.min(255, Math.floor(( value / 30) * 255));
                                         green = Math.min(255, Math.floor((1 - value / 30) * 255));
                                        }
                                        else if(value <= 15){
                                            green = Math.min(255, Math.floor((value / 15) * 255));
                                            blue = Math.min(255, Math.floor((1 - value / 15) * 255));
                                        }

                                        return `rgb(${red},${green},${blue})`;
                                    }
                                }
                                $frequencyChart.find(".barlist").append($barContainer);
                                $barList.append($frequencyChart);
                                //let $element = $(self.element);
                            }
                        );

                        if(test== true){                        
                            Promise.all([self.fetchSurvey(device.overview.id)]).then(
                            (results) => {
                                console.log(results);
                            });


                    }
                        // Checkbox was checked
                    } else if (event.target.checked && device.overview.antenna.name == "Omni"){
                        console.log(device)
                        $button.data("link", addCircle(device));
                    }
                    else {

                        const link = $button.data("link");
                        link.setMap(null);
                        // Checkbox was unchecked
                    }
                });

                $deviceList.append($deviceItem);
                $deviceMapList.append($deviceMapItem);
                const infowindow = new google.maps.InfoWindow({
                    content: $deviceMapItem[0],
                    ariaLabel: device.overview.ssid,
                  });
                deviceMarker.addListener("click", () => {
                    infowindow.open({
                      anchor: deviceMarker,
                      map,
                    });

                  });


            }
            
        }
        for (i = 0; i < ($deviceHead.length); i++) {
            const $th = $deviceHead[i].children[0];
            const n =i;
            if($th){
                $th.addEventListener("click", function() {
                    sortTable(n);
                    console.log($th.classList);
                    //let toggle = $th.classList.find(class => item.id === targetId)
                    if($th.classList.value.includes("flip")){
                        console.log("works");
                    }
                    //$th.addClass("flip");
                    // This function will be called when the button is clicked
                });
            }
        }

        for(var i = 0; i < devices.length; i++){
            let device = devices[i];
            console.log(testMarkers(device,points));
        }
        

        function testMarkers(device, points){
           let x = device.location.longitude;
           let y = device.location.latitude;
           let beamwidth = device.overview.antenna.angle;
           let heading = device.location.heading;
           let matches = points.filter(point => point.y < Math.tan((heading+beamwidth/2)*Math.PI / 180)*(point.x- x)+y && point.y > Math.tan((heading-beamwidth/2)*Math.PI / 180)*(point.x- x)+y);
            return matches;
        }
        function addCircle(device){
            let link = new google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.15,
                map,
                center: {lat:device.location.latitude, lng:device.location.longitude},
                radius: 1000,
              });
        
                link.setMap(map);
              return link;
        }
        function addPolygon(device){
            let TP = device.trasmitPower;
            let TG = device.overview.antenna.gain;
            let cableLoss = 2;
            let Rp = -70;
            let frequency = device.overview.frequency;
            let eirp = device.overview.antenna.eirp;
            let distance = 12;
            console.log(distance);
            let antennaAngle = device.overview.antenna.angle;
            let azimuth = device.location.heading;
            let azimuth1 = azimuth + (antennaAngle/2);
            let azimuth2 = azimuth - (antennaAngle/2);
            let polyCoords = [
                {lat:device.location.latitude, lng:device.location.longitude},
                calculateNewCoordinates(device.location.latitude,device.location.longitude,distance,azimuth1),
                calculateNewCoordinates(device.location.latitude,device.location.longitude,distance,azimuth2),
                {lat:device.location.latitude, lng:device.location.longitude},
            
            ];
            let link = new google.maps.Polygon({
                paths: polyCoords,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.15,
              });
        
                link.setMap(map);
              return link;

      function calculateNewCoordinates(lat1, lon1, distance, azimuth) {
        // Convert degrees to radians
        lat1 = lat1 * (Math.PI / 180);
        lon1 = lon1 * (Math.PI / 180);
        azimuth = azimuth * (Math.PI / 180);
      
        // Earth's radius in kilometers
        const earthRadiusKm = 6371.0;
      
        // Convert distance to radians
        const angularDistance = distance / earthRadiusKm;
      
        // Calculate new latitude
        const lat2 = Math.asin(
          Math.sin(lat1) * Math.cos(angularDistance) +
          Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(azimuth)
        );
      
        // Calculate new longitude
        const lon2 = lon1 + Math.atan2(
          Math.sin(azimuth) * Math.sin(angularDistance) * Math.cos(lat1),
          Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
        );
      
        // Convert radians to degrees for latitude and longitude
        const newLat = lat2 * (180 / Math.PI);
        const newLon = lon2 * (180 / Math.PI);
      
        return { lat: newLat, lng: newLon };
      }
      function calculateFSPL(EIRP_dBm, Pr) {
        // Calculate the FSPL in dB
        const FSPL = EIRP_dBm - Pr;
        return FSPL;
      }
      function calculateCoverageDistance(FSPL, frequency, bandwidth) {
        // Speed of light (m/s)
        const speedOfLight = 299792458;
      
        // Reference distance (1 meter)
        const d0 = 1;
      
        // Calculate the maximum distance in meters
        const maxDistance = d0 * Math.pow(10, (FSPL - 20 * Math.log10(frequency) - 20 * Math.log10(4 * Math.PI)) / 20);
        return maxDistance;
      }
    }
    function sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = $deviceList[0];
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc"; 
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
          //start by saying: no switching is done:
          switching = false;
          rows = table.children;
          /*Loop through all table rows (except the
          first, which contains table headers):*/
          for (i = 0; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;

            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            } else if (dir == "desc") {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
          }
          if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
          } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }
      }


        this.map.fitBounds(latlngbounds);
       

        // $deviceList.find(".btnDeviceRestart").on("click", this.onDeviceRestartClick)
        // $deviceList.find(".btnDeviceRefresh").on("click", this.onDeviceRefreshClick)
        
    }

    bind(){
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(window.location.href);

            const mapOptions = {
                center: {
                  lat: 42.4117322,
                  lng: -85.4871588
                },
                zoom: 4,
                gestureHandling:"auto",
                fullscreenControl: false,
                disableDoubleClickZoom: true,
                disableDefaultUI: false,
                keyboardShortcuts: false,
                scrollwheel: true,
                streetViewControl: false
              };
              this.waypoints = [];
            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);


            Promise.all([self.fetchApDevices()]).then(
                (results) => {
                    let devices = results[0];

                    const activeAp = devices.filter(device => device.identification.type !== "airCube"&& device.overview && device.overview.status === "active");
                    console.log(activeAp);
                    // for(var i = 0; i < activeAp.length; i++){
                    //     activeAp[i] = activeAp[i].identification.id;
                    // }
                 Promise.all([self.fetchSimulation()]).then(
                        (results) => {
                            let devices = results[0].devices;

                             devices = devices.filter(device =>activeAp.find(activeAp => activeAp.identification.id === device.deviceId));
                             console.log(devices);
                                for(var i = 0; i < devices.length; i++){
                                    let device = devices[i];
                                    
                                    let foundObject = activeAp.find(activeAp => activeAp.identification.id === device.deviceId);
                                    
                                    if(foundObject){
                                        foundObject.location.heading = device.heading;
                                        foundObject.overview.antenna = device.antenna;
                                        foundObject.overview.antenna.eirp = device.eirp;
                                    }
                                }
                            activeAp.sort(this.sortDeviceByFrequency);
                            console.log(activeAp);
                            self.bindDevices(activeAp);
                            //let $element = $(self.element);
                        }
                    );

                    //let $element = $(self.element);

                    
                }
            );
        });
    }

    init(){
        self = this;
        return new Promise((resolve, reject) => {
            try{
                const googleLoader = new google.maps.plugins.loader.Loader({
                    apiKey: $.uisptools.common.settings.system.googleApiKey,
                    version: "weekly",
                    libraries: []
                });
                googleLoader.loadCallback((ex) => {
                    if (ex) {
                        $.logToConsole("ERROR google loader: " + ex.toString()); 
                    } else {
                      // new google.maps.Map(document.getElementById("map"), mapOptions);
                    }
                  });
                Promise.all([googleLoader.load(),this.loadTemplate()]).then(
                    function(){
                        self.bind().then(
                            function(){
                                resolve();
                            },
                            function(err){
                                reject(err)
                            }

                        );
                    },
                    function(err){
                        reject(err)
                    } 
                )
            }catch(ex){
                $.logToConsole("ERROR loadWidget: " + ex.toString());
                reject(ex);
            }
        })
    }
   
}

export {channelmap}
export default channelmap
