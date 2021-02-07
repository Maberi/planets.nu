// ==UserScript==
// @name        Horwasp mining
// @author      Mario Benito
// @copyright   Mario Benito, 2021
// @license     Lesser Gnu Public License, version 2.1
// @homepage	https://github.com/Maberi/planets.nu
// @downloadURL https://greasyfork.org/es/scripts/421380-horwasp-mining
// @description Adds mining info for Horwasp race planets and allocation screen
// @namespace   maberi/planets.nu
// @include     https://planets.nu/*
// @include     https://*.planets.nu/*
// @include     http://planets.nu/*
// @include     http://*.planets.nu/*
// @version     1.0
// @grant       none
// ==/UserScript==

if (!GM_info) GM_info = GM.info;

var name = GM_info.script.name;
var version = GM_info.script.version;


var horwaspMining = function() {};

vgap.registerPlugin(horwaspMining, name);
console.log(name + " v"+version+" planets.nu plugin registered");

horwaspMining.loadResources = function() {
    var planet = this.planet;

    var neu = "/" + gsv(planet.groundneutronium);
    var dur = "/" + gsv(planet.groundduranium);
    var tri = "/" + gsv(planet.groundtritanium);
    var mol = "/" + gsv(planet.groundmolybdenum);
    if (planet.groundduranium < 0 && planet.totalduranium > 0) {
        neu = planet.totalneutronium;
        dur = planet.totalduranium;
        tri = planet.totaltritanium;
        mol = planet.totalmolybdenum;
    }

    var cls = "head";

    var html = "";

    var mines = planet.mines;
    if (vgap.player.raceid == 12) mines = Math.ceil(Math.sqrt((planet.clans + planet.larva) * planet.targetmines / 100 * 0.7));

    if (vgap.gameUsesFuel())
        html += "<div class='lval neu'><b>Neutronium</b>" + gsv(planet.neutronium) + "<span><div style='color:" + vgap.densityToColor(planet.densityneutronium) + ";'>" + neu + "</div><span>" + (mines <= 0 ? "(" + gsv(planet.densityneutronium) + "%)" : vgap.miningText(planet, planet.groundneutronium, planet.densityneutronium, mines)) + "</span></span ></div > ";

    html += "<div class='lval dur'><b>Duranium</b>" + gsv(planet.duranium) + "<span><div style='color:" + vgap.densityToColor(planet.densityduranium) + ";'>" + dur + "</div><span>" + (mines <= 0 ? "(" + gsv(planet.densityduranium) + "%)" : vgap.miningText(planet, planet.groundduranium, planet.densityduranium, mines)) + "</span></span></div>" +
        "<div class='lval tri'><b>Tritanium</b>" + gsv(planet.tritanium) + "<span><div style='color:" + vgap.densityToColor(planet.densitytritanium) + ";'>" + tri + "</div><span>" + (mines <= 0 ? "(" + gsv(planet.densitytritanium) + "%)" : vgap.miningText(planet, planet.groundtritanium, planet.densitytritanium, mines)) + "</span></span></div>" +
        "<div class='lval mol'><b>Molybdenum</b>" + gsv(planet.molybdenum) + "<span><div style='color:" + vgap.densityToColor(planet.densitymolybdenum) + ";'>" + mol + "</div><span>" + (mines <= 0 ? "(" + gsv(planet.densitymolybdenum) + "%)" : vgap.miningText(planet, planet.groundmolybdenum, planet.densitymolybdenum, mines)) + "</span></span></div>";

    if (vgap.player.raceid == 12)
        html += "<div class='lval supplies' style='margin-top: 8px;'><b>Supplies</b>" + gsv(planet.supplies) + "</div>";


    return html;
}

horwaspMining.planetMiningAbility = function(planet) {
    var mines = Math.ceil(Math.sqrt((planet.clans + planet.larva) * planet.targetmines / 100 * 0.7));

    return "Neutronium " + vgap.miningText(planet, planet.groundneutronium, planet.densityneutronium, mines, true) + "<br/>" +
           "Duranium " + vgap.miningText(planet, planet.groundduranium, planet.densityduranium, mines, true) + "<br/>" +
           "Tritanium " + vgap.miningText(planet, planet.groundtritanium, planet.densitytritanium, mines, true) + "<br/>" +
           "Molybdenum " + vgap.miningText(planet, planet.groundmolybdenum, planet.densitymolybdenum, mines, true);
}

horwaspMining.allocateWorkers = function () {
    var planet = this.planet;
    var resting = this.unallocated();

    vgap.more.empty();
    vgap.moreTitle("Allocate Workers");

    var html = "<div id='AllocateScreen'>";
    html += "<div id='tform'></div>";

    var burrowText = "Burrow can hold " + addCommas(planet.burrowsize * 100) + " workers - " + Math.round((planet.burrowsize / (planet.clans + planet.larva)) * 100) + "%.";
    if (planet.targetdefense > 0)
        burrowText += " Adding room for " + addCommas(Math.floor(((planet.targetdefense / 100) * planet.clans) / 4) * 100) + " more.";

    var liqClans = Math.floor((planet.colonisttaxrate / 100) * planet.clans);
    var liquifyText = "Liquify " + addCommas(liqClans * 100) + " workers into " + Math.floor(Math.pow(liqClans, 2 / 3)) + " neutronium.";

    html += "<div class='allocationdata'>";
    html += "<div class='formshow showharvest'><p>" + vgap.planetDefenseAbility(planet) + "</p></div>";
    html += "<div class='formshow showmining'><p>" + horwaspMining.planetMiningAbility(planet) + "</p></div>";
    html += "<div class='formshow showburrowing'><p>" + burrowText + "</p></div>";
    html += "<div class='formshow showterraforming'><p>Planet Temp: " + vgap.planetScreen.getTempChange() + "</p></div>";
    html += "<div class='formshow showliquify'><p>" + liquifyText + "</p></div>";
    html += "</div>";

    html += "<label style='display: block; width: 120px; height: 32px; line-height: 32px; position: absolute; right: 0px; top: 40px; z-index: 12; margin: 0px; color: #fff; font-size: 14px; vertical-align: middle; text-align: center'>Fixed <input id ='HappinessCheckbox' type='checkbox' style='width: 20px; height: 20px; vertical-align: middle;' " + (this.planet.colchange == 1 ? "checked='yes'" : "") + "/></label>";

    html += "</div>";

    $(html).appendTo(vgap.more);

    shtml.formrows = new Array();

    var harvestLabel = "Harvest";
    if (planet.nativetype == 9)
        harvestLabel = "Exterminate";

    var init = "mining";
    if (planet.nativeclans > 0) {
        shtml.formRow("harvest", harvestLabel, planet.targetfactories, null, function (change) { vgap.planetScreen.alloHarvest(change); }, null, 10, "-+");
        init = "harvest";
    }
    shtml.formRow("mining", "Mining", planet.targetmines, null, function (change) { vgap.planetScreen.alloMining(change); }, null, 10, "-+");
    shtml.formRow("burrowing", "Burrowing", planet.targetdefense, null, function (change) { vgap.planetScreen.alloBurrow(change); }, null, 10, "-+");
    if (planet.temp != 50)
        shtml.formRow("terraforming", "Terraforming", planet.builtmines, null, function (change) { vgap.planetScreen.alloTerra(change); }, null, 10, "-+");
    if (vgap.gameUsesFuel())
        shtml.formRow("liquify", "Liquify", planet.colonisttaxrate, null, function (change) { vgap.planetScreen.alloAlchemy(change); }, null, 10, "-+");
    shtml.formRow("resting", "Resting", resting, null, null, null, null, null, true);

    $("#HappinessCheckbox").tclick(function () { vgap.planetScreen.setHappinessCheckBoxValue(this); vgap.planetScreen.allocateWorkers(); });

    vgap.planetScreen.screen.refresh();
    vgap.showMore();

    shtml.initTControl(init);
}


// Loaddashboard callback
// Called after definition of all screens
horwaspMining.loaddashboard = function() {
    vgap.planetScreen.__proto__.loadResources = horwaspMining.loadResources;
    vgap.planetScreen.__proto__.allocateWorkers = horwaspMining.allocateWorkers;
}
