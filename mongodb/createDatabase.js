use uisptools
db.createUser(
{
   user:"uisptools",
   pwd:"U!spT00l$!",
   roles: [ { role: "dbOwner", db: "DETools" }]
}
)


db.createCollection( "ut_RefreshToken",
   {     
     autoIndexId: true
   }
)

db.ut_RefreshToken.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )

db.ut_RefreshToken.createIndex( { "refreshTokenId": 1 } )

db.createCollection( "ut_AuthToken",
   {     
     autoIndexId: true
   }
)

db.ut_AuthToken.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )

db.ut_AuthToken.createIndex( { "authTokenId": 1 } )


db.createCollection( "ut_PageContent",
   {
     
     autoIndexId: true
   }
)

db.ut_PageContent.createIndex( { "pageContentGuid": 1 } )

db.ut_PageContent.insert(
[
{
    "_id" : ObjectId("5edea608a7f66bdcd0decba7"),
    "content" : "<h3>Wireless Company Inc.</h3><p>Wireless Company Inc is an Anytown, AnyCountry based company that provides wireless internet service.</p><p><br/></p><p>Our <a href=\"/deui/ContentPage/57052780-ec76-4026-84ac-47d7697c39ff\" target=\"\">wireless internet service</a> uses <a href=\"https://www.ubnt.com/broadband/\" target=\"_blank\">Ubiquiti</a> 5 Ghz TDMA AirMAX AC radios for guaranteed throughput and reliability offering speeds up to 100+Mbps. The 5 GHz radio band is a line of sight frequency and clear line of site is required. If you can see one of our towers then you can receive service. �Please visit our <a href=\"/deui/ContentPage/57052780-ec76-4026-84ac-47d7697c39aa\" target=\"\">coverage map</a> to view our tower locations and see if you are within our coverage area.</p><p><br/></p><p><br/></p><p><br/></p><p><br/></p>",
    "createdBy" : "",
    "createdDate" : "2012-11-12T14:34:29.77+00:00",
    "deleted" : false,
    "displayOrder" : 100,
    "extendedArrayData" : "",
    "extendedBooleanData" : false,
    "extendedNumericData" : 0,
    "extendedTextData" : "",
    "linkMenuDisplay" : true,
    "linkStatus" : 1,
    "linkTarget" : "_self",
    "linkText" : "Home",
    "linkUrl" : "/",
    "pageContentGuid" : "00000000-0000-0000-0000-000000000001",
    "pageDescription" : " Website Home Page",
    "pageKeywords" : "",
    "pageName" : "Home",
    "pageTitle" : "Home Page",
    "parentPageContentGuid" : null,
    "updatedBy" : "adevries@digitalexample.com",
    "updatedDate" : "2016-02-22T16:00:04.593+00:00"
},

/* 2 */
{
    "_id" : ObjectId("5edea71da7f66bdcd0decbee"),
    "content" : "<div><h2>WiFi Internet Service</h2><div><span style=\"color: rgb(85, 85, 85);float: none;background-color: rgb(255, 255, 255);\">Digital Example provides wireless internet service to the Vicksburg, Michigan area.�<br/>Please visit our <a href=\"/deui/ContentPage/57052780-ec76-4026-84ac-47d7697c39aa\" target=\"\">coverage map</a> to view our tower locations and see if you are within our coverage area</span></div></div><div><h3 style=\"color: rgb(85, 85, 85);\">Residential Wireless</h3></div><p style=\"text-align: left;color: rgb(85, 85, 85);\"><img src=\"/images/residential_wireless.png\" style=\"float: left;\"/><br/></p><p style=\"text-align: left;color: rgb(85, 85, 85);\">Digital Examples Wireless Internet Access service makes high-speed Internet access affordable for everyone.�</p><p style=\"text-align: left;color: rgb(85, 85, 85);\">Here are some of our features:</p><ul style=\"color: rgb(85, 85, 85);\"><li style=\"text-align: left;\">High Speed Internet 20 Mbps burstable up to 75 Mbps</li><li style=\"text-align: left;\">Wireless Technology</li><li style=\"text-align: left;\">Serving the Vicksburg Michigan Area</li><li style=\"text-align: left;\">$40 a Month</li><li style=\"text-align: left;\">No Contracts</li></ul><h4 style=\"color: rgb(85, 85, 85);\"><em><u><br/></u></em></h4><h4 style=\"color: rgb(85, 85, 85);\"><em><u><br/></u></em></h4><h4 style=\"color: rgb(85, 85, 85);\"><em><u><br/></u></em></h4><h4 style=\"color: rgb(85, 85, 85);\"><em><u>Wireless access features:</u></em></h4><ul style=\"color: rgb(85, 85, 85);\"><li>No cable or telephone line subscription required</li><li>Short-range radio link avoids the high latency and reliability problems associated with satellite Internet access</li><li>Digital Example is a locally owned and operated company<strong></strong></li><li>Support for any number of computers on your network<strong></strong></li><li>Fully automated, plug-and-play authentication (no authentication software required!)</li><li>No contract obligation</li><li><br/></li></ul><h4 style=\"color: rgb(85, 85, 85);\"><em><u>Equipment:</u></em></h4><p style=\"color: rgb(85, 85, 85);\">Digital Example supplies the following customer-end equipment:<strong></strong></p><ul style=\"color: rgb(85, 85, 85);\"><li>Wireless Broadband Radio<strong></strong></li><li>Power Injector<strong></strong></li><li>Ethernet Surge Suppressor (when necessary)<strong></strong></li><li>Ethernet Cables<strong></strong></li><li>In Home Routers and Access Points</li></ul><p><br style=\"color: rgb(85, 85, 85);\"/></p><p style=\"color: rgb(85, 85, 85);\">The equipment terminates into a standard �Category 5 Ethernet connector that plugs into your existing Ethernet firewall, hub, switch or network interface card.</p><p style=\"color: rgb(85, 85, 85);\">Customers farther than 2 miles from a wireless access tower may need to use a focusing dish to obtain a strong enough signal for service. We will notify potential customers that a dish is required when returning the results of a site survey.</p><h4 style=\"color: rgb(85, 85, 85);\"><em><u>Installation:</u></em></h4><p style=\"color: rgb(85, 85, 85);\">Installation is done by one of our professional installers.</p><h4 style=\"color: rgb(85, 85, 85);\"><em><u>Always-On Wireless Internet</u></em></h4><p style=\"color: rgb(85, 85, 85);\">Digital Example uses 5 GHz high-frequency radio technology to transmit and receive data to and from your home or business. There's no telephone line and no dialing; you're always connected. A small radio transceiver is mounted on your home or office building that establishes the connection with one of our broadcast locations. Because the radios require clear line of site between the transmitting and receiving antennas, the radio is typically mounted on the roof, chimney or on an existing television antenna mast.</p><p style=\"color: rgb(85, 85, 85);\">A network cable is run from the radio transceiver to a small power injector in your home or office. You simply plug the network connector on the power injector into your computer's network interface card and you're on the air! You can even connect your entire home or office network to the Internet using the same radio transceiver.</p><p style=\"color: rgb(85, 85, 85);\">We realize that many homeowners associations are concerned about the appearance of external antennas. Digital Example has selected a radio transceiver that is so small it's hardly noticeable. In addition, in the interest of ensuring that broadband Internet access is made available to the masses, the Federal Communications Commission (FCC) has passed a ruling that allows wireless Internet access antennas to be installed even in areas where homeowners association's rules prevent other types of antennas. A copy of the FCC document detailing this ruling is available at<span class=\"Apple-converted-space\">�<a href=\"http://www.fcc.gov/mb/facts/otard.html\" target=\"\">http://www.fcc.gov/mb/facts/otard.html</a></span></p><hr style=\"height: 1px;color: rgb(85, 85, 85);\"/><p style=\"color: rgb(85, 85, 85);\">1. Activation and installation fees are non-refundable.</p><p style=\"color: rgb(85, 85, 85);\">2. Professional installation includes mounting the subscriber module and surge suppressor (when necessary) and running and securing the network cable down the outside of the building and in through a single wall penetration. Alternative wiring solutions, custom wall jacks, etc. are also available for an additional charge.</p>",
    "createdBy" : "adevries",
    "createdDate" : "2015-01-01T00:00:00+00:00",
    "deleted" : false,
    "displayOrder" : 110,
    "extendedArrayData" : "",
    "extendedBooleanData" : false,
    "extendedNumericData" : 0,
    "extendedTextData" : "",
    "linkMenuDisplay" : true,
    "linkStatus" : 1,
    "linkTarget" : "_self",
    "linkText" : "Wifi Service",
    "linkUrl" : "/deui/ContentPage/WifiService",
    "pageContentGuid" : "57052780-ec76-4026-84ac-47d7697c39ff",
    "pageContentId" : 2,
    "pageDescription" : "Wireless Internet Service",
    "pageKeywords" : "",
    "pageName" : "WifiService",
    "pageTitle" : "Wireless Internet Service",
    "parentPageContentGuid" : null,
    "updatedBy" : "adevries@digitalexample.com",
    "updatedDate" : "2020-06-04T03:07:28.1175594+00:00"
},

/* 3 */
{
    "_id" : ObjectId("5edea770a7f66bdcd0decbfd"),
    "content" : "<div><h2>Wireless Coverage Map</h2><div><span style=\"color: rgb(85, 85, 85);float: none;background-color: rgb(255, 255, 255);\">Digital Example provides wireless internet service to the Vicksburg, Michigan area.</span></div></div><div><span style=\"color: rgb(85, 85, 85);float: none;background-color: rgb(255, 255, 255);\"><br/></span></div><div><span style=\"color: rgb(85, 85, 85);float: none;background-color: rgb(255, 255, 255);\">For an interactive Google Map with our tower locations, please click <a href=\"https://www.google.com/maps/d/edit?mid=zbL5nW-V0Fz4.k5mqilvqJrno&amp;usp=sharing\" target=\"_blank\">here</a></span></div><div><h3 style=\"color: rgb(85, 85, 85);\">Tower Locations Map</h3></div><p style=\"text-align: left;color: rgb(85, 85, 85);\"><img src=\"/images/WiFi_Coverage_Map.jpg\"/><br/></p>",
    "createdBy" : "adevries",
    "createdDate" : "2015-01-01T00:00:00+00:00",
    "deleted" : false,
    "displayOrder" : 110,
    "extendedArrayData" : "",
    "extendedBooleanData" : false,
    "extendedNumericData" : 0,
    "extendedTextData" : "",
    "linkMenuDisplay" : true,
    "linkStatus" : 1,
    "linkTarget" : "_self",
    "linkText" : "Wifi Coverage Map",
    "linkUrl" : "/deui/ContentPage/WifiCoverage",
    "pageContentGuid" : "57052780-ec76-4026-84ac-47d7697c39aa",
    "pageDescription" : "Wireless Coverage",
    "pageKeywords" : "",
    "pageName" : "WifiCoverage",
    "pageTitle" : "Wireless Coverage",
    "parentPageContentGuid" : "57052780-ec76-4026-84ac-47d7697c39ff",
    "updatedBy" : "adevries@digitalexample.com",
    "updatedDate" : "2015-09-08T03:15:43.253+00:00"
},

/* 4 */
{
    "_id" : ObjectId("5edea9cca7f66bdcd0decc8f"),
    "content" : "<div data-de-admin></div>",
    "createdBy" : "adevries",
    "createdDate" : "2015-01-01T00:00:00+00:00",
    "deleted" : false,
    "displayOrder" : 105,
    "extendedArrayData" : "",
    "extendedBooleanData" : false,
    "extendedNumericData" : 0,
    "extendedTextData" : "",
    "linkMenuDisplay" : true,
    "linkStatus" : 1,
    "linkTarget" : "_self",
    "linkText" : "Admin",
    "linkUrl" : "/admin/admin.htm",
    "pageContentGuid" : "dc5370c8-8eee-4557-a146-f4e07423ddad",
    "pageContentId" : 5,
    "pageDescription" : "Admin Page",
    "pageKeywords" : "",
    "pageName" : "",
    "pageTitle" : "Admin Page",
    "parentPageContentId" : 0,
    "roleId" : "admin",
    "updatedBy" : "adevries",
    "updatedDate" : "2015-01-01T00:00:00+00:00"
},

/* 5 */
{
    "_id" : ObjectId("5edeaa1ea7f66bdcd0deccaa"),
    "content" : "",
    "createdBy" : "adevries",
    "createdDate" : "2015-01-01T00:00:00+00:00",
    "deleted" : false,
    "displayOrder" : 105,
    "extendedArrayData" : "",
    "extendedBooleanData" : false,
    "extendedNumericData" : 0,
    "extendedTextData" : "",
    "linkMenuDisplay" : true,
    "linkStatus" : 1,
    "linkTarget" : "_blank",
    "linkText" : "MI Billing",
    "linkUrl" : "https://billing.example.com",
    "pageContentGuid" : "57052780-ec76-4026-84ac-6297697c39ff",
    "pageContentId" : 12,
    "pageDescription" : "Billing Website",
    "pageKeywords" : "",
    "pageName" : "Billing",
    "pageTitle" : "Billing Website",
    "parentPageContentGuid" : null,
    "updatedBy" : "adevries@digitalexample.com",
    "updatedDate" : "2016-02-22T16:13:10.4+00:00"
},

/* 6 */
{
    "_id" : ObjectId("5edeab15a7f66bdcd0decce3"),
    "content" : "<p></p><div class=\"  col--xs12 col--lg9 left \">            <h3>OUR PRIVACY POLICY WAS UPDATED ON JANUARY 1, 2020</h3><h5><b>Privacy Policy</b></h5><p>    This Privacy Policy (the �<span class=\"textBold\">Policy</span>�) describes how Company Name and its subsidiaries    and affiliates (&#34;<span class=\"textBold\">we</span>&#34;, &#34;<span class=\"textBold\">us</span>&#34;, &#34;<span class=\"textBold\">our</span>&#34;) collect and use personal and other information through our 1) websites, and their sub-domains and any other websites hosted by    us (collectively the "<span class=\"textBold\">Sites</span>"), (2) services or software accessible or downloadable    through the Sites ("<span class=\"textBold\">Web Apps</span>"), (3) software that may be downloaded to your smartphone    or tablet to access services ("<span class=\"textBold\">Mobile Apps</span>"), (4) software ("<span class=\"textBold\">Firmware</span>") that is installed on our hardware products ("<span class=\"textBold\">Products</span>") and (5) subscription    services, including services that can be accessed using the Web Apps and Mobile Apps ("<span class=\"textBold\">Subscription Services</span>"),    all for use in conjunction with Products. The term <span class=\"textBold\">Services</span> means the Sites, Web Apps, Mobile Apps, Firmware, Subscription Services and Products. The term <span class=\"textBold\">you</span> or    <span class=\"textBold\">your</span> as used in this Policy, means any person or entity who accesses or uses the    Services.</p><p>    </li></ul><br/></div>",
    "createdBy" : "adevries",
    "createdDate" : "2015-01-01T00:00:00+00:00",
    "deleted" : false,
    "displayOrder" : 110,
    "extendedArrayData" : "",
    "extendedBooleanData" : false,
    "extendedNumericData" : 0,
    "extendedTextData" : "",
    "linkMenuDisplay" : true,
    "linkStatus" : 1,
    "linkTarget" : "_self",
    "linkText" : "Privacy Policy",
    "linkUrl" : "/deui/ContentPage/PrivacyPolicy",
    "pageContentGuid" : "57052780-ec76-4026-84ac-47d7697c94ae",
    "pageContentId" : 15,
    "pageDescription" : "Privacy Policy",
    "pageKeywords" : "",
    "pageName" : "PrivacyPolicy",
    "pageTitle" : "Privacy Policy",
    "parentPageContentGuid" : null,
    "roleId" : "",
    "updatedBy" : "adevries@digitalexample.com",
    "updatedDate" : "2020-02-05T22:14:15.9529891+00:00"
}
]
)
