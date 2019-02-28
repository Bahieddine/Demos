"use strict";

(function ($) {
  $(window).bind("load", function () {
    //check if it is infusion centers directory
    if ($('.infusion-center') != undefined) {
      //search functionality helpers
      var Search = async function Search(zipCode, area, zoom) {
        try {
          userCoords = await getCoords(zipCode, 1);
        } catch (error) {
          $('.infusion-center.err-msg').removeClass('hide');
          $('.infusion-center .search .zip').addClass('has-error');
          console.log('get coords error: ', error);
          return;
        }

        $('.infusion-center.err-msg').addClass('hide');
        $('.infusion-center .search .zip').removeClass('has-error');
        $('.infusion-center .search, .infusion-center .right-side, .infusion-center .left-side').removeClass('no-search');
        $('.infusion-center .lef-side .result .views-row').removeClass('show');
        $('.use-instructions').removeClass('no-search'); //show tabs for mobile

        $('.infusion-center .tabs').removeClass('no-search'); //find near centers in given area

        nearInfusionCenters = [];
        infusionCenters.forEach(async function (infusionCenter, index) {
          var distance = calcDistance(infusionCenter.coords, userCoords);

          if (distance <= area) {
            infusionCenter.milesAway = (distance / 1609.344).toFixed(2);
            nearInfusionCenters.push(infusionCenter);
          }
        });
        buildMap(userCoords, area, zoom);

        if (nearInfusionCenters.length > 0) {
          $('.infusion-center .left-side .no-result').addClass('hide');
          $('.infusion-center .left-side .result').removeClass('hide'); //sort locations by near first

          nearInfusionCenters.sort(function (a, b) {
            return a.milesAway - b.milesAway;
          });
          $('.infusion-center .left-side .result').empty();
          nearInfusionCenters.forEach(function (infusionCenter, index) {
            //add marker
            var infowindow = new google.maps.InfoWindow({
              content: ' <div><p><strong>' + infusionCenter.name + '</strong></p><p>' + infusionCenter.street + '</p></div>'
            });
            var infusionMarker = new google.maps.Marker({
              map: map,
              position: {
                lat: infusionCenter.coords.lat(),
                lng: infusionCenter.coords.lng()
              },
              title: infusionCenter.name,
              animation: google.maps.Animation.DROP
            });
            infusionMarker.addListener('click', function () {
              infowindow.open(map, infusionMarker);
            }); //update Dom

            infusionCenter.htmlCode.appendTo('.infusion-center .left-side .result');
            $('.infusion-center .left-side .result .views-row').eq(index).find('.directions .miles-away').html(infusionCenter.milesAway + ' miles');
            $('.infusion-center .left-side .result .views-row').eq(index).addClass('show');
          });
        } else {
          $('.infusion-center .left-side .result').addClass('hide');
          $('.infusion-center .left-side .no-result').removeClass('hide'); //print no results.
        }
      };

      var buildMap = function buildMap(center, circleR, zoom) {
        var centerCoords = center;
        var options = {
          zoom: zoom,
          center: center
        };
        map = new google.maps.Map(document.getElementById('map'), options);
        var marker = new google.maps.Marker({
          map: map,
          position: {
            lat: centerCoords.lat(),
            lng: centerCoords.lng()
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#FF0000',
            fillOpacity: 0.6,
            strokeColor: '#FF0000',
            strokeOpacity: 0.9,
            strokeWeight: 2,
            scale: 5
          }
        });
        var cityCircle = new google.maps.Circle({
          strokeColor: '#00F',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00F',
          fillOpacity: 0.35,
          map: map,
          center: {
            lat: centerCoords.lat(),
            lng: centerCoords.lng()
          },
          radius: circleR
        });
      };

      var getCoords = async function getCoords(address, delay) {
        var delayBy = delay * 600;
        var coordsPromise = new Promise(function (resolve, reject) {
          setTimeout(function () {
            geocoder.geocode({
              address: address
            }, function (results, status) {
              if (status === 'OK') {
                console.log(address, results[0].geometry.location.lat(), results[0].geometry.location.lng());
                resolve(results[0].geometry.location);
              } else {
                reject(status);
              }
            });
          }, delayBy);
        });
        return await coordsPromise;
      };

      var calcDistance = function calcDistance(origin, dest) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, dest);
        return distance;
      };

      var userZIP,
          miles,
          areaDistance,
          zoom,
          userCoords,
          map,
          geocoder = new google.maps.Geocoder();
      var nearInfusionCenters = [];
      var loaded = false,
          counter = 0,
          centersNumber = $('.infusion-center .left-side .result .views-row').length;
      var infusionCenters = []; // infusion centers informations

      var additionalContent = '<div class="directions">' + '<span class="miles-away"></span> <span class="sep">|</span> <span class="cyan get-directions">Get Driving Directions</span>' + '</div>' + '<div class="all-center-deatils">' + '<p class="cyan show-more">' + 'Show all center details <span>+</span>' + '</p>' + '<p class="cyan show-less hide">Show fewer center details <span>-</span></p>' + '</div>'; //add additional content

      $('.infusion-center .left-side .result .views-row').each(function (index) {
        // try {
        //     var coords = await getCoords($(this).find('.street').text(), index);
        //     counter += 1;
        // } catch (err) {
        //     if (err === 'OVER_QUERY_LIMIT') {
        //         var coords = await getCoords($(this).find('.street').text(), index);
        //         counter += 1;
        //     }
        //     console.log(err);
        // }
        var coords = new google.maps.LatLng(parseFloat($(this).find('.lat').text()), parseFloat($(this).find('.lng').text()));
        var elBefore = $(this).find('.center-detail:eq(0)');
        $(additionalContent).insertBefore(elBefore);
        infusionCenters.push({
          name: $(this).find('.center_name').text(),
          street: $(this).find('.street').text(),
          city: $(this).find('.city').text(),
          state: $(this).find('.state').text(),
          postalCode: $(this).find('.postal').text(),
          index: index,
          htmlCode: $(this).detach(),
          coords: coords
        });
        counter += 1;
        loaded = counter === centersNumber ? true : false;

        if (loaded) {
          console.log('loaded');
        }
      });
      $('.all-center-deatils').click(function () {
        $(this).children().toggleClass('hide');
        $(this).parent().children('.center-detail').toggleClass('show');
      });
      $(document).on('click', '.all-center-deatils', function () {
        $(this).children().toggleClass('hide');
        $(this).parent().children('.center-detail').toggleClass('show');
      }); //search functionality

      $('.infusion-center .search .btn').click(function () {
        userZIP = $('.infusion-center .search .zip input').val();
        miles = $('.infusion-center .search .miles select').val();
        areaDistance = miles * 1609.344;
        zoom = $(window).width() > 767 ? 11 - miles / 10 + 1 : 11 - miles / 10;

        if (zoom < 7) {
          zoom = 7;
        }

        Search(userZIP, areaDistance, zoom);
      });
      $('.infusion-center .search h4').click(function () {
        $('.infusion-center .search, .infusion-center .right-side, .infusion-center .left-side').addClass('no-search');
        $('.use-instructions').addClass('no-search');
        $('.infusion-center .search .zip input').val('');
        $('.infusion-center .search .miles select').val(['10']);
      });
      $('.infusion-center .tabs li').click(function () {
        $('.infusion-center .tabs li').removeClass('active');
        $(this).addClass('active');
        $('.infusion-center .left-side').toggleClass('hidden-xs');
        $('.infusion-center .right-side #map').toggleClass('hidden-xs');
      });
      $('.infusion-center .directions .get-directions').click(function () {
        // var directionsService = new google.maps.DirectionsService();
        // var directionsDisplay = new google.maps.DirectionsRenderer();
        // directionsDisplay.setMap(map);
        // var start = userCoords;
        var end = infusionCenters[$(this).closest('.views-row').index()].coords; // console.log(end);
        // var request = {
        //     origin: start,
        //     destination: end,
        //     travelMode: 'DRIVING'
        // };
        // directionsService.route(request, function(result, status) {
        //     if (status == 'OK') {
        //       directionsDisplay.setDirections(result);
        //     }
        // });
        var url = 'https://www.google.com/maps/dir/?api=1&destination=' + end.lat() + ',' + end.lng() + '&travelmode=driving';
        $('#leave').modal('show');
        $('#leave.modal .modal-body a.btn').attr('href', url); // window.open(url, '_blank');
          
      });
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      $(document).on('click', '.infusion-center .directions .get-directions', function () {
        // directionsDisplay.setMap(null);
        // var start = userCoords;
        var end = nearInfusionCenters[$(this).closest('.views-row').index()].coords; // var request = {
        //     origin: start,
        //     destination: end,
        //     travelMode: 'DRIVING'
        // };
        // directionsService.route(request, function(result, status) {
        //     if (status == 'OK') {
        //       directionsDisplay.setDirections(result);
        //     }
        // });

        var url = 'https://www.google.com/maps/dir/?api=1&destination=' + end.lat() + ',' + end.lng() + '&travelmode=driving';
        $('#leave').modal('show');
        $('#leave.modal .modal-body a.btn').attr('href', url); // window.open(url, '_blank');
      });
    }
  });
})(jQuery);