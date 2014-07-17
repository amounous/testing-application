/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    
    $.getJSON("json/map.json", function (data){
        
        defaultRainfall = [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
        defaultTemperature = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
        var colorR = 100;
        var colorG = 131;
        var colorB = 173;
        
        var functionMouseOver = function(e)
        {
            var country = e.target;
            var countryName = country.name;
            var chartComponent = $('#chart').highcharts('Chart');

            chartComponent.series[0].setData(country.rainfallData);
            chartComponent.series[1].setData(country.temperatureData);
            
            chartComponent.setTitle({text: 'Average Monthly Temperature and Rainfall in ' + countryName});
        };
        
        var functionClick = function(e)
        {
            colorR = (colorR * 1000) % 255;
            colorG = (colorG * 1000) % 255;
            colorB = (colorB * 1000) % 255;
            var currentCountry =  e.currentTarget;
            var chartComponent = $('#chart').highcharts('Chart');
            
            if ( !currentCountry.selected )
            {
                currentCountry.selected = true;
                currentCountry.colorOrigin = currentCountry.color;
                currentCountry.color = "rgb(" + colorR + "," + colorG + "," + colorB + ")";
                
                var rainfallSeries = {
                    name: 'Rainfall (' + currentCountry.name + ')',
                    type: 'column',
                    yAxis: 1,
                    data: currentCountry.rainfallData,
                    tooltip: {
                        valueSuffix: ' mm'
                    },
                    color: currentCountry.color
                };
                
                var temperatureSeries = {
                    name: 'Temperature (' + currentCountry.name + ')',
                    type: 'spline',
                    data: currentCountry.temperatureData,
                    tooltip: {
                        valueSuffix: '°C'
                    }
                };
                
                chartComponent.addSeries(rainfallSeries);
                currentCountry.rainfallSeriesId = chartComponent.series.length - 1;
                chartComponent.addSeries(temperatureSeries);
                currentCountry.temperatureSeriesId = chartComponent.series.length - 1;
            }
            else
            {
                currentCountry.selected = false;
                currentCountry.color = currentCountry.colorOrigin;
                
                chartComponent.series[currentCountry.temperatureSeriesId].remove();
                chartComponent.series[currentCountry.rainfallSeriesId].remove();
            }
            
        };
        
        var events = {
            "mouseOver" : functionMouseOver,
            "click" : functionClick
        };
        
        $.each(data, function(key, country){
            country.events = events;
            
            var valueRainfall = new Array(defaultRainfall.length);
            var valueTemperature = new Array(defaultTemperature.length);
            
            $.each(defaultRainfall, function(key, value){
                valueRainfall[key] = value * country.value / 100
            });
            
            $.each(defaultTemperature, function(key, value){
                valueTemperature[key] = value * country.value / 100
            });
            
            country.rainfallData = valueRainfall;
            country.temperatureData = valueTemperature;   
            country.selected = false;
        });
        
        $('#map').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/oi.js">custom/world</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'left'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
    });
});

