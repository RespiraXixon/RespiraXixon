var map;
var lastLayer;
var legendControl;

function inicializa_mapa(datos) {
	
	console.log(datos);
	// crea mapa
	map = new L.Map('mapa');

	// crea el layer
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © OpenStreetMap contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});		

	// Comenzamos el mapa en Gijon
	map.setView(new L.LatLng(43.5450394,-5.6626443),13);
	map.addLayer(osm);
	
	// Añadimos la capa de mapa

		
	var layerControl = new L.Control.Layers({
		'Capa original': osm 
	}).addTo(map);
	
	//Creamos una funcion para añadir grupos de capas de datos al mapa
	var createLayerGroup = function (name) {
		var layerGroup = new L.LayerGroup();
		
		map.addLayer(layerGroup);
		layerControl.addOverlay(layerGroup, name);
		
		return layerGroup;
	};
	
	//Escala de colores TODO: Probar escala de colores
	
	
	// Initialize framework linear functions for mapping earthquake data properties to Leaflet style properties
	// Color scale - green to red using the basic HSLHueFunction
	var magnitudeColorFunction = new L.HSLHueFunction(new L.Point(0,90), new L.Point(10,0), {outputSaturation: '100%', outputLuminosity: '25%'});
	var magnitudeFillColorFunction = new L.HSLHueFunction(new L.Point(0,90), new L.Point(10,0), {outputSaturation: '100%', outputLuminosity: '50%'});
	var magnitudeRadiusFunction = new L.LinearFunction(new L.Point(0,5), new L.Point(10,25));
	// Color scale - white to orange to red using a PiecewiseFunction
	// NOTE:  Uncomment these lines to see the difference
	/*
	var magnitudeColorFunction = new L.PiecewiseFunction([
		new L.HSLLuminosityFunction(new L.Point(0,0.8), new L.Point(4,0.3), {outputSaturation: '100%', outputHue: 30}),
		new L.HSLHueFunction(new L.Point(4,30), new L.Point(10,0), {outputLuminosity: '30%'})
	]);
		
	var magnitudeFillColorFunction = new L.PiecewiseFunction([
		new L.HSLLuminosityFunction(new L.Point(0,1), new L.Point(4,0.5), {outputSaturation: '100%', outputHue: 30}),
		new L.HSLHueFunction(new L.Point(4,30), new L.Point(10,0))
	]);
	*/
	
	// TODO: Ver que hacen estas funciones de opacidad
	var now = Math.round((new Date()).getTime());
	var start = now - 86400000;

	// Initialize a linear function to map earthquake time to opacity
	var timeOpacityFunction = new L.LinearFunction(new L.Point(start,0.3), new L.Point(now,1));
	
	
	//TODO:Poner los datos a continuación del display Name
	// Crear una nueva capa
	var dataLayer1 = new L.DataLayer(datos,{
		recordsField: 'calidadairemediatemporales.calidadairemediatemporal',
		latitudeField: 'latitud',
		longitudeField: 'longitud',
		locationMode: L.LocationModes.LATLNG,
		displayOptions: {
			'titulo': {
				displayName: 'Estaci&oacute;n: ',
				color: magnitudeColorFunction,
				fillColor: magnitudeFillColorFunction,
				radius: magnitudeRadiusFunction
			},
			'co': {
				displayName: 'CO: '
			},
			'so2': {
				displayName: 'S02: '
			},
			'o3': {
				displayName: 'Ozono: '
			},
			'fechasolar_utc_': {
				displayName: 'Fecha:',
				opacity: timeOpacityFunction,
				fillOpacity: timeOpacityFunction,
				displayText: function (value) {
					return new Date(value).toLocaleString(); 
				}
			}
		},
		layerOptions: {
			numberOfSides: 4,
			radius: 10,
			weight: 1,
			color: '#000',
			opacity: 0.2,
			fillOpacity: 0.7,
			dropShadow: true
		},
		tooltipOptions: {
			iconSize: new L.Point(200,210),
			iconAnchor: new L.Point(-4,210)
		},
		onEachRecord: function (layer,record) {
			var $html = L.HTMLUtils.buildTable(record);
			
			layer.bindPopup($html.wrap('<div/>').parent().html(),{
				minWidth: 400,
				maxWidth: 400
			});
		}
	});
	
	
	
	var contaminantesLayer1 = createLayerGroup('Contaminantes 1');
	
	contaminantesLayer1.addLayer(dataLayer1);
	
	//TODO:Poner los datos a continuación del display Name
	// Crear una nueva capa
	var dataLayer2 = new L.DataLayer(datos,{
		recordsField: 'calidadairemediatemporales.calidadairemediatemporal',
		latitudeField: 'latitud',
		longitudeField: 'longitud',
		locationMode: L.LocationModes.LATLNG,
		displayOptions: {
			'titulo': {
				displayName: 'Estaci&oacute;n: ',
				color: magnitudeColorFunction,
				fillColor: magnitudeFillColorFunction,
				radius: magnitudeRadiusFunction
			},
			'no': {
				displayName: 'NO: '
			},
			'ben': {
				displayName: 'Benceno: '
			},
			'fechasolar_utc_': {
				displayName: 'Fecha:',
				opacity: timeOpacityFunction,
				fillOpacity: timeOpacityFunction,
				displayText: function (value) {
					return new Date(value).toLocaleString(); 
				}
			}
		},
		layerOptions: {
			numberOfSides: 4,
			radius: 10,
			weight: 1,
			color: '#000',
			opacity: 0.2,
			fillOpacity: 0.7,
			dropShadow: true
		},
		tooltipOptions: {
			iconSize: new L.Point(200,210),
			iconAnchor: new L.Point(-4,210)
		},
		onEachRecord: function (layer,record) {
			var $html = L.HTMLUtils.buildTable(record);
			
			layer.bindPopup($html.wrap('<div/>').parent().html(),{
				minWidth: 400,
				maxWidth: 400
			});
		}
	});
	
	var contaminantesLayer2 = createLayerGroup('Contaminantes 2');
	
	contaminantesLayer2.addLayer(dataLayer2);
	
	// Inicializamos la leyenda y la añadimos al mapa
	var legendControl = new L.Control.Legend();
	
	legendControl.addTo(map);

	
	/*
	//Insertamos iconos
	
	var LeafIcon = L.Icon.extend({
		options: {
			iconSize:     [15, 35],
			iconAnchor:   [15, 35],
			popupAnchor:  [-3, -76]
		}
	});
	
	var semaforo_verde = new LeafIcon({iconUrl: '../images/semaforo_verde.jpg'});

	//Procesamos el jason
	$.each(datos.estaciones.estacion, function() {
	    console.log(this);
	    L.marker([this.latitud,this.longitud], {icon: semaforo_verde}).bindPopup(this.titulo).addTo(map);
	});
	*/
}


/*
$(document).ready(function() {

	// Function for resizing the map to fill the available space on the screen
	var resize = function () {
		var $map = $('#mapa');
		
		$map.height($(window).height() - $('div.navbar').outerHeight());
		
		if (map) {
			map.invalidateSize();
		}
	};
	
	// Resize the map element on window resize
	$(window).on('resize', function () {
		resize();
	});
	
	// Resize the map element
	resize();
	
	// Initialize the map
	map = L.map('mapa').setView([0.0, 0.0], 2);
	
	// Add a CloudMade tile layer with style #999
	var baseLayer = L.tileLayer('http://{s}.tile.cloudmade.com/82e1a1bab27244f0ab6a3dd1770f7d11/999/256/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	});
	
	baseLayer.addTo(map);
	
	var prccEarthquakesLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/bclc-apec.map-rslgvy56/{z}/{x}/{y}.png', {
		attribution: 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
	});
	
	// Initialize the legend control and add it to the map
	var legendControl = new L.Control.Legend();
	
	legendControl.addTo(map);
	
	var layerControl = new L.Control.Layers({
		'Cloudmade': baseLayer,
		'PRCC Earthquake Risk Zones': prccEarthquakesLayer 
	});
	
	layerControl.addTo(map);
});*/