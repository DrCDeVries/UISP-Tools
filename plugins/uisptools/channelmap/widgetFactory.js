"use strict"

import baseClientSide from "/uisptools/plugins/baseClientSide.js";
import {channelmap} from "./widgets/channelmap/channelmap.js"

class widgetFactory extends baseClientSide.widgetFactory
    {
        init(){
            return new Promise((resolve, reject) => {
                //this is where if I needed to excute some one time code would go
                super.init().then(
                    function(){
                        resolve();
                    },
                    function(err){
                        reject(err);
                    }
                )
                $.logToConsole("INFO: channelmap widget factory " + this.name + " init");
            });
        }
        //This gets called once per widget created
        createWidget(widgetName, element, options){
            return new Promise((resolve, reject) => {
                let widget = null;
                switch(widgetName){
                    case "channelmap":
                        //constructor(widgetFactory, widgetname, element, options) 
                        widget = new channelmap(this, widgetName, element,options);
                        resolve(widget);
                }
            });
        }
    }





    export {widgetFactory}
    export {channelmap}
    export default widgetFactory