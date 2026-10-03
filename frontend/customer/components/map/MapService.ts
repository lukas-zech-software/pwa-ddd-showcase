import MarkerClusterer                from '@google/markerclustererplus';
import { IS_SERVER }                  from '@my-old-startup/frontend-common/constants';
import { logService }                 from '@my-old-startup/frontend-common/services/LogService';
import { google }                     from 'google-maps/lib/types';
import throttle                       from 'lodash.throttle';
import { reaction }                   from 'mobx';
import {
  IApiCompanyMinimal,
  ILatLngBoundsLiteral,
}                                     from '../../../../common/interfaces';
import {
  boundsToCoords,
  latLngBoundToBounds,
}                                     from '../../../../common/utils/geoUtils';
import { loadGoogleMapsApi }          from '../../common/GoogleMapsLoaderService';
import { CompanySearchResultMinimal } from '../../common/types';
import { searchService }              from '../../services/SearchService';
import { locationStore }              from '../../store/LocationStore';
import { searchStore }                from '../../store/SearchStore';

export let mapService: MapService;

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers:     [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers:     [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers:     [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers:     [
      {
        visibility: 'off',
      },
    ],
  },
];

function getMarkerIcon(company: IApiCompanyMinimal): string {
  if (company.corona.offersReopen === true) {
    return 'https://storage.googleapis.com/static.my-old-startups-domain.de/images/reopen_map_marker.svg?v=9';
  }

  if (company.corona.offersDelivery === true || company.corona.offersTakeAway === true) {
    return 'https://storage.googleapis.com/static.my-old-startups-domain.de/images/deal_map_marker.svg?v=9';
  }

  return 'https://storage.googleapis.com/static.my-old-startups-domain.de/images/coupon_map_marker.svg';
}

if (IS_SERVER === false) {
  reaction(
    () => searchStore.currentCompanyResults,
    results => {
      if (mapService && mapService.isInit) {
        mapService.drawMarkers(results);
      }
    },
  );
  reaction(
    () => locationStore && locationStore.location,
    () => {
      if (mapService && mapService.isInit) {
        mapService.update();
      }
    },
  );
}

class MapService {
  public isInit: boolean;
  public isMounted: boolean           = false;
  public blockUpdate: boolean         = false;
  public blockLocationUpdate: boolean = false;
  private cluster: MarkerClusterer | undefined;
  private lastMarkerCount: number | undefined;

  private getBoundsPromiseResolve: ((bound?: ILatLngBoundsLiteral) => void) | undefined = undefined;
  private mapInstance: google.maps.Map & { resizeListenerBound?: boolean };
  private locationMarker: google.maps.Marker;
  private mapsApi: google;
  private clickHandler: (companyId: string) => void;

  public async loadApi(): Promise<void> {
    this.mapsApi = await loadGoogleMapsApi();
  }

  public async init(width: string | undefined,
                    clickHandler: (companyId: string,
                    ) => void,
  ): Promise<Element> {
    if (this.mapsApi === undefined) {
      console.warn('google maps api not initialised');
      return document.createElement('div');
    }

    if (this.mapInstance === undefined) {
      const mapDiv = document.createElement('div');
      mapDiv.setAttribute('style', 'width:100%;height:100%');

      this.mapInstance    = new this.mapsApi.maps.Map(mapDiv, {
        center:            locationStore.location.coordinates,
        zoom:              13,
        minZoom:           5,
        styles:            MAP_STYLE,
        zoomControl:       width !== 'xs' && width !== 'sm',
        fullscreenControl: false,
        streetViewControl: false,
        gestureHandling:   'greedy',
        clickableIcons:    false,
      });
      this.locationMarker = new this.mapsApi.maps.Marker({
                                                           map:      this.mapInstance,
                                                           title:    'Position',
                                                           position: locationStore.location.coordinates,
                                                           visible:  false,
                                                           icon:     {
                                                             path:          this.mapsApi.maps.SymbolPath.CIRCLE,
                                                             scale:         7,
                                                             fillColor:     'black',
                                                             fillOpacity:   .3,
                                                             strokeColor:   'black',
                                                             strokeOpacity: .3,
                                                             strokeWeight:  5,
                                                           },
                                                         });

      this.setPanHandler();
      this.lastMarkerCount = undefined;
      //this.checkEmptyMap();
      this.isInit          = true;
    }
    this.clickHandler = clickHandler;

    return this.mapInstance.getDiv();
  }

  public fitBounds(bounds: google.maps.LatLngBoundsLiteral): void {
    this.blockUpdate = true;
    this.mapInstance.fitBounds(bounds, 0);
  }

  public panTo(location: google.maps.LatLngLiteral): void {
    this.blockUpdate = true;
    this.mapInstance.panTo(location);
  }

  public panAndZoomTo(location: google.maps.LatLngLiteral, zoom: number): void {
    this.panTo(location);
    this.mapInstance.setZoom(zoom);
  }

  public drawMarkers(results: CompanySearchResultMinimal[]): void {
    if (this.isMounted == false) {
      return;
    }

    if (this.cluster) {
      this.cluster.clearMarkers();
    }

    const takenLocations = new Set<string>();

    const markers = results.map((result, i) => {
      let location      = result.company.location;
      const shiftDouble = takenLocations.has(`${location.lat}/${location.lng}`);
      takenLocations.add(`${location.lat}/${location.lng}`);

      if (shiftDouble) {
        location = {
          lat: location.lat + 0.000050,
          lng: location.lng + 0.000050,
        };
      }

      const marker = new this.mapsApi.maps.Marker({
                                                    position: location,
                                                    icon: {
                                                      url:        getMarkerIcon(result.company),
                                                      scaledSize: new this.mapsApi.maps.Size(40, 40, 'px', 'px'),
                                                      size:       new this.mapsApi.maps.Size(40, 40, 'px', 'px'),
                                                    },
                                                  });
      //addListener is called with bind()
      const that   = this;
      marker.addListener('touchstart', (e) => {
        that.onClick(e, result);

      });

      marker.addListener('click', (ev: any) => {
        that.onClick(ev, result);
      });

      return marker;
    });

    // Add a marker clusterer to manage the markers.
    this.cluster = new MarkerClusterer(this.mapInstance,
                                       markers,
                                       {
                                         maxZoom:            14,
                                         minimumClusterSize: 2,
                                         ignoreHidden:       true,
                                         imagePath:          'https://storage.googleapis.com/static.my-old-startups-domain.de/images/cluster.png',
                                       });

    // Force redraw cluster on first draw
    setTimeout(() => {
      this.cluster!.repaint();
    }, 500);

  }

  public update(): void {
    if (this.isMounted === false) {
      return;
    }

    this.locationMarker.setPosition(locationStore.location.coordinates);
    this.locationMarker.setVisible(locationStore.customBounds);

    if (this.blockLocationUpdate) {
      this.blockLocationUpdate = false;
      return;
    }

    if (locationStore.location.bounds) {
      this.fitBounds(boundsToCoords(locationStore.location.bounds));
    } else {
      // if it has no bounds, its hopefully a street or something local
      this.panAndZoomTo(locationStore.location.coordinates, 17);
    }
  }

  /*
    private checkEmptyMap(): void {
      setTimeout(() => {

        let visibleMarkers: google.maps.Marker[] = [];
        let bounds                               = this.mapInstance.getBounds();
        if (bounds && this.cluster) {
          this.cluster.getMarkers().forEach(marker => {
            const position = marker.getPosition();
            if (position) {
              if (bounds!.contains(position)) {
                visibleMarkers.push(marker);
              }
            }
          });
          console.log('visibleMarkers', visibleMarkers);
          runInAction(() => {
            searchStore.mapViewIsEmpty = visibleMarkers.length === 0;
          });
        }

      }, 500);
    }*/

  private onClick(e: any, result: CompanySearchResultMinimal): void {
    // object name is minified, search for  stopPropagation
    Object.keys(e).forEach((key) => {
      if (e[key] && e[key].stopPropagation) {
        e[key].target.no_click = true;
        e[key].stopPropagation();
      }
    });
    this.clickHandler(result.company.id);
    this.panTo(result.company.location);
  }

  private setPanHandler(): void {
    const that                = this;
    let mouseDown: boolean    = false;
    let userAction: boolean   = false;
    let missedAction: boolean = false;
    let firstPaint: boolean   = true;

    this.mapsApi.maps.event.addListener(this.mapInstance, 'mouseup', function() {
      mouseDown = false;
      if (missedAction) {
        that.mapsApi.maps.event.trigger(that.mapInstance, 'bounds_changed');
      }
    });

    this.mapsApi.maps.event.addListener(this.mapInstance, 'touchend', function() {
      mouseDown = false;
      if (missedAction) {
        that.mapsApi.maps.event.trigger(that.mapInstance, 'bounds_changed');
      }
    });

    this.mapsApi.maps.event.addListener(this.mapInstance, 'touchcancel', function() {
      mouseDown = false;
      if (missedAction) {
        that.mapsApi.maps.event.trigger(that.mapInstance, 'bounds_changed');
      }
    });

    this.mapsApi.maps.event.addListener(this.mapInstance, 'mousedown', function() {
      mouseDown  = true;
      userAction = true;
    });

    this.mapsApi.maps.event.addListener(this.mapInstance, 'touchstart', function() {
      mouseDown  = true;
      userAction = true;
    });

    this.mapsApi.maps.event.addListener(this.mapInstance, 'click', function() {
      mouseDown  = true;
      userAction = true;
    });

    this.mapsApi.maps.event.addListener(this.mapInstance, 'bounds_changed', throttle(function(this: null) {
      that.setBoundsToLocation();

      if (firstPaint) {
        firstPaint       = false;
        that.blockUpdate = false;
        return;
      }

      if (mouseDown) {
        missedAction = true;
        return;
      }

      missedAction = false;

      if (that.blockUpdate === true) {
        that.blockUpdate = false;
        return;
      }

      void that.searchCurrentMapBounds();
    }, 500));
  }

  public getBounds(): Promise<ILatLngBoundsLiteral | void> {
    if (this.isMounted === false) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        logService.error('Map did not respond within timeout');
        this.getBoundsPromiseResolve = undefined;
        resolve();
      }, 750);

      this.getBoundsPromiseResolve = (bounds) => {
        clearTimeout(timeout);
        resolve(bounds);
      };
    });
  }

  public setBoundsToLocation(): ILatLngBoundsLiteral | void {
    if (this.getBoundsPromiseResolve) {
      const mapBounds = this.mapInstance.getBounds();

      if (mapBounds) {
        this.getBoundsPromiseResolve(latLngBoundToBounds(mapBounds.toJSON()));
      } else {
        this.getBoundsPromiseResolve();
      }

      this.getBoundsPromiseResolve = undefined;
    }
  }

  private async searchCurrentMapBounds(): Promise<void> {
    let mapBounds = this.mapInstance.getBounds();
    let center    = this.mapInstance.getCenter();

    if (center && mapBounds) {
      // wrap center and bounds as it they are invalid once the map was rotated 1 full orbit
      center    = new this.mapsApi.maps.LatLng(center.toJSON());
      mapBounds = new this.mapsApi.maps.LatLngBounds(
        new this.mapsApi.maps.LatLng(mapBounds.getSouthWest().toJSON()),
        new this.mapsApi.maps.LatLng(mapBounds.getNorthEast().toJSON()),
      );

      if (locationStore.location.bounds) {
        const storeBounds  = new this.mapsApi.maps.LatLngBounds(locationStore.location.bounds.southwest, locationStore.location.bounds.northeast);
        const isSameBounds = mapBounds.equals(storeBounds);
        const cointainsNE  = storeBounds.contains(mapBounds.getNorthEast());
        const cointainsSW  = storeBounds.contains(mapBounds.getSouthWest());

        if (isSameBounds || (cointainsNE && cointainsSW)) {
          return;
        }
      }

      this.blockLocationUpdate = true;
      try {
        await locationStore.setLocation({ location: center }, {
          bounds:     latLngBoundToBounds(mapBounds.toJSON()),
          filterType: 'locality',
        });
        void searchService.search();
      } catch (e) {

      }
    }
  }
}

export async function getInstance(width: string | undefined, clickHandler: (companyId: string) => void): Promise<Element> {
  if (!mapService) {
    mapService = new MapService();
    await mapService.loadApi();
  }
  return mapService.init(width, clickHandler);
}
