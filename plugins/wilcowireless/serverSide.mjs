"use strict"
import baseServerSide from "../baseServerSide.mjs";
    
var wilcowireless = {
  plugin :  class plugin extends baseServerSide.plugin
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
                    this.debug("trace", "wilcowireless widget factory " + this.name + " init");
                });
                
            }

            bindRoutes(router){
                
                try {
                    super.bindRoutes(router);
                    //Any Routes above this line are not Checked for Auth and are Public
                    router.get('/uisptools/wilcowireless/api/*', this.checkApiAccess);
                    router.get('/uisptools/wilcowireless/api/towerclients', this.getTowerSitesClients); 
                } catch (ex) {
                   this.debug("error", ex.msg, ex.stack);
                }
            }

            fetchSiteClients(siteId){
                return $.uisptools.ajax("/uisptools/api/nms/sites/" + siteId + "/clients");
            }
            
            fetchSiteDetails(siteId){
                return $.uisptools.ajax("/uisptools/api/nms/sites/" + siteId);
            }
    
            fetchSiteClientsWithDetails(siteId){
                return new Promise((resolve, reject) => {
                    try{
                        
                        var clientDetailPromise = [];
                        self.fetchSiteClients(siteId).then(
                            function(clientIds){
                                for(var i = 0; i < clientIds.length; i++){
                                    let clientId = clientIds[i];
                                    clientDetailPromise.push(self.fetchSiteDetails(clientId))
                                }
                                Promise.all(clientDetailPromise).then(
                                    function(clients){
                                        resolve(clients)
                                    },
                                    function(err){
                                        var objError = $.uisptools.createErrorFromScriptException(ex, "Server error during wilcowireless.towerclients.fetchSiteClientsWithDetailes.");
                                        reject(objError);        
                                    }
                                )
                            },
                            function(err){
                                var objError = $.uisptools.createErrorFromScriptException(ex, "Server error during wilcowireless.towerclients.fetchSiteClientsWithDetailes.");
                                reject(objError);        
                            }
                        )
                    }catch(ex){
                        $.logToConsole("ERROR wilcowireless.towerclients.fetchSiteClientsWithDetailes: " + ex.toString());
                        var objError = $.uisptools.createErrorFromScriptException(ex, "Server error during wilcowireless.loadWidget.");
                        reject(objError);
                    }
                })
            }

            getTowerSitesClients(req, res){
                try{
                    this.getPluginUserData(req,res).then((userPluginData) =>{
                        if(userPluginData && userPluginData.sites){
                            var dataFetches = []
                            userPluginData.sites.forEach(siteId => {
                                dataFetches.push(self.fetchSiteClientsWithDetails(siteId))
                            });
                            Promise.all(dataFetches).then(
                                function(results){
                                    var clients = []
                                    results.forEach(siteClients => {
                                        clients = clients.concat(siteClients);
                                    });
                                    self.bindClients(clients);
                                    //let $element = $(self.element);
                                    
                                }
                            )
                        }
                    })
                }catch(ex){
                    this.debug("error", "getTowerClients", ex.msg, ex.stack);
                    res.status(500).json({ "msg": "An Error Occured!", "error": ex });
                }
            }
            
        }
}

export {wilcowireless}
export default wilcowireless