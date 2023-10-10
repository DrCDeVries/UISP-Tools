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
        let aFreq = a.frequency;
        let bFreq = b.frequency
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
        $deviceItem.attr("data-deviceId", device.id);
        $deviceItem.find(".deviceShow").find(".deviceCheckbox").attr("data-deviceIndex", options.index);
        $deviceItem.find(".deviceName").text(device.name);
        $deviceItem.find(".deviceModel").text(device.deviceName);
        $deviceItem.find(".deviceIpAddress").text(device.deviceName);
        $deviceItem.find(".deviceType").text(device.apType);


        if(device && device.frequency){
            $deviceItem.find(".deviceFrequency").text(device.frequency );
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
        let $deviceMapList = $element.find(".deviceMapList").empty();
        let $deviceItemTemplate = $element.find(".templates").find(".deviceTemplate").find(".deviceItem");
        let $deviceMapItemTemplate = $element.find(".templates").find(".deviceMapTemplate").find(".deviceMapItem");
        const aircubeImage = "/images/devices/aircube.png";
        const gpsLightImage = "/images/devices/gpslite.png";
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




        for(var i = 0; i < devices.length; i++){

            
            let device = devices[i];

            if(device.latitude&&device.longitude){


                  const deviceMarker = new google.maps.Marker({
                    position: { lat: device.latitude, lng: device.longitude },
                    map,
                    icon: image,
                    title: device.name + " " + device.frequency
                });
                latlngbounds.extend(new google.maps.LatLng(device.latitude, device.longitude))
                let $deviceItem = $deviceItemTemplate.clone();
                let $deviceMapItem = $deviceMapItemTemplate.clone();
                this.updateDeviceItem({device:device, $deviceItem: $deviceItem,index:i});
                this.updateDeviceItem({device:device, $deviceItem: $deviceMapItem,index:i});
                let $deviceCheckboxTemplate = $deviceItem.find(".deviceShow").find(".deviceCheckbox");
                $deviceCheckboxTemplate.on('click', function(event) {
                    
                    const $button = $(this);
                    if (event.target.checked) {
                        $button.data("link", addPolygon(device));
                        // Promise.all([self.fetchSurvey(device.deviceId)]).then(
                        //     (results) => {
                        //         let devices = results[0];
                        //         console.log(results);
                        //         //let $element = $(self.element);
                        //     }
                        // );
                        // Checkbox was checked
                    } else {

                        const link = $button.data("link");
                        link.setMap(null);
                        // Checkbox was unchecked
                    }
                });
                $deviceList.append($deviceItem);
                $deviceMapList.append($deviceMapItem);
                const infowindow = new google.maps.InfoWindow({
                    content: $deviceMapItem[0],
                    ariaLabel: device.name,
                  });
                deviceMarker.addListener("click", () => {
                    infowindow.open({
                      anchor: deviceMarker,
                      map,
                    });

                  });


            }
            
        }

        
        function addPolygon(device){
            let distance = device.coverageCpeHeight * device.height/100;
            let antennaAngle = device.antenna.angle;
            let azimuth = device.heading;
            let azimuth1 = azimuth + (antennaAngle/2);
            let azimuth2 = azimuth - (antennaAngle/2);
            let polyCoords = [
                {lat:device.latitude, lng:device.longitude},
                calculateNewCoordinates(device.latitude,device.longitude,distance,azimuth1),
                calculateNewCoordinates(device.latitude,device.longitude,distance,azimuth2),
                {lat:device.latitude, lng:device.longitude},
            
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
                    for(var i = 0; i < activeAp.length; i++){
                        activeAp[i] = activeAp[i].identification.id;
                    }

                    //let $element = $(self.element);
                    Promise.all([self.fetchSimulation()]).then(
                        (results) => {
                            let devices = results[0].devices;
                             devices = devices.filter(device => activeAp.includes(device.deviceId));
                            devices.sort(this.sortDeviceByFrequency);
                            self.bindDevices(devices);
                            //let $element = $(self.element);
                            
                        }
                    );
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
