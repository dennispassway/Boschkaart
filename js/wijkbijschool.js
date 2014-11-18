// Pak data.
var data = [], rows;
d3.csv("dataset.csv", function(loadedRows) {
	rows = loadedRows;
	$.each(rows, function(value,key){
		data.push([value,key]);
	});

	getShitDone();
});

// Pak postcode data.
var postcodedata = [], rows;
d3.csv("postcode-school.csv", function(loadedRows) {
	rows = loadedRows;
	$.each(rows, function(value,key){
		postcodedata.push([value,key]);
	});
});

// Build a map.
var layer = new L.StamenTileLayer("toner");
var map = new L.Map("map", {
	center: new L.LatLng(51.7050,5.318427),
	zoom: 13,
	zoomControl: false,
	minZoom: 12,
	maxZoom: 14,
});
map.addLayer(layer);

// Get some icons.
var rood = L.icon({
	iconUrl: 'img/red-icon.png',
	iconSize:     [20, 25],
	iconAnchor:   [10, 25],
	popupAnchor:  [0, -30]
});

var oranje = L.icon({
	iconUrl: 'img/orange-icon.png',
	iconSize:     [20, 25],
	iconAnchor:   [10, 25],
	popupAnchor:  [0, -30]
});

var semigroen = L.icon({
	iconUrl: 'img/semi-green-icon.png',
	iconSize:     [20, 25],
	iconAnchor:   [10, 25],
	popupAnchor:  [0, -30]
});

var groen = L.icon({
	iconUrl: 'img/green-icon.png',
	iconSize:     [20, 25],
	iconAnchor:   [10, 25],
	popupAnchor:  [0, -30]
});

// Get Shit Done.
var school = '';  // Schoolvariabele voor titel van marker.
function getShitDone() {
	for(i=0; i<data.length; i++){
		var maatstaf = 42;

		// Pak getal.
		getal = parseInt(data[i][1].hoog);
		schoolnaam = data[i][1].schoolnaam;
		adres = data[i][1].adres;
		postcode = data[i][1].postcode;
		plaats = data[i][1].plaats;
		telnr = data[i][1].telnr;
		email = data[i][1].email;
		website = data[i][1].website;

		// Pak icoon.
		if (getal < 25){icoontje = rood;}
		else if (getal < 40){icoontje = oranje;}
		else if (getal < 55){icoontje = semigroen;}
		else if (getal >= 55){icoontje = groen;}

		// Pak lat lng.
		var lat = data[i][1].lat;
		var lng = data[i][1].lng;

		// Zet marker.
		var options = {
			icon: icoontje,
			title: data[i][1].schoolnaam,
			riseOnHover: true,
		};
		var marker = L.marker([lat,lng], options);
		marker.bindPopup("<span class='schooltitel'>" + schoolnaam + "</span><br><span class='schooladres'>" + adres + "<br>" + postcode + "<br>" + plaats + "<br><br></span><span class='schoolcontact'>" + telnr + "<br>" + email + "<br>" + website + "</span><br><br><b>" + getal + "% gaat naar HAVO of hoger.</b>");

		marker.addTo(map);

		// Onclick pak schoolnaam en stamp naar postcodeVerwerkins.
		marker.on('click', function(e) {
			school = this.options.title;
			postcodeVerwerkings();

			this.setOpacity(1);
		});
	}
}

// Verwerk postcode biatch.
var schoolPostcodes = []; // Variabele voor postcodes die naar school gaan.
function postcodeVerwerkings() {
	schoolPostcodes.length = 0;
	for(i=0; i<postcodedata.length; i++) {
		if (postcodedata[i][1].schoolNaam == school) {
			schoolPostcodes.push([postcodedata[i][1].postcodeLeerlingen,postcodedata[i][1].aantalLeerlingen]);
		}
	}
	wijkKleuren(school);
}

// Opacity maken
function opacityWijk() {
	if (schoolPostcodes[i][1] < 6) {
		return 0.2;
	}
	if (schoolPostcodes[i][1] > 5 && schoolPostcodes[i][1] < 11) {
		return 0.4;
	}
	if (schoolPostcodes[i][1] > 10 && schoolPostcodes[i][1] < 51) {
		return 0.5;
	}
	if (schoolPostcodes[i][1] > 51 && schoolPostcodes[i][1] < 101 ) {
		return 0.6;
	}
	if (schoolPostcodes[i][1] > 100 && schoolPostcodes[i][1] < 150 ) {
		return 0.7;
	}
	if (schoolPostcodes[i][1] > 150) {
		return 0.8;
	}
}

// Reset wijken als popup wordt gesloten.
map.on('popupclose', function(e) {
	map.removeLayer(wijken);
});

// Kleur de wijken G.
var wijken = ''; // Variabele voor layer van wijken.
function wijkKleuren(school) {
	var x = 0;
	map.removeLayer(wijken);
	wijken = L.geoJson(geowijken, {
		style: function(feature) {
		for(i=0;i<schoolPostcodes.length;i++){
			if (feature.properties.POSTCODE == schoolPostcodes[i][0]) { 
				return {
				color: "#000000",
				weight: 3,
				opacity: 0.6,
				fillOpacity: opacityWijk(),
				fillColor: "#cd1634"
			};
		}
	}
	return {color: "#ff0000", fillColor: "#3399ff", weight: 3, opacity: 0, fillOpacity: 0};
	}
}).addTo(map);

// Zoomniveau functie.
function zoomNiveau() {
	switch(school)
	{
		// Uitgezoomt.
		case "Jenaplanschool Antonius Abt":
		case "Rooms Katholieke Basisschool Paus Joannes":
		case "Basisschool Imam Albogari":
		case "ATO basisschool L W Beekman":
		case "RK Basisschool De Kameleon":
		case "Rooms Katholieke Basisschool het Bossche Broek":
		case "ATO basisschool Het Rondeel":
		case "Vrije School De Driestroom":
		case "Basisschool Jeroen Bosch":
		case "Basisschool De Matrix":
		case "ATO basisschool De Springplank":
		case "ATO basisschool Noorderlicht":
		case "ATO basisschool Meander":
		case "ATO montessorischool Merlijn":
		case "ATO basisschool Madelief":
		case "Basisschool 't Wikveld":
		case "Wittering.nl":
		case "ATO basisschool De Groote Wielen":
		case "Kindcentrum De Hoven":
		case "Basisschool 't Ven":
		case "ATO basisschool De Overlaet":
		case "Rooms Kaholieke Basisschool De Borch":
		case "ATO basisschool De Kruisstraat":
		case "De Troubadour School voor Basisonderwijs":
		return 12;
		break;

		// Standaard.
		default:
		return 13;
	}
}

// Centreren marker & zoomfunctie aanroepen.
for(i=0; i<data.length; i++) {
	if (data[i][1].schoolnaam == school) {
		map.setView(new L.LatLng(data[i][1].lat, data[i][1].lng), zoomNiveau());
	}
}

};

// Popup Klikjes.
$('#uitleg').show();

$('#uitlegLink').click(function() {
	$('#uitleg').toggle();
	$('#artikel').hide();
	$('#datasets').hide();
	$('#contact').hide();
});

$('#artikelLink').click(function() {
	$('#artikel').toggle();
	$('#uitleg').hide();
	$('#datasets').hide();
	$('#contact').hide();
});

$('#datasetsLink').click(function() {
	$('#datasets').toggle();
	$('#uitleg').hide();
	$('#artikel').hide();
	$('#contact').hide();
});

$('.close').click(function() {
	$(this).parent().hide();
});