import React, { useCallback, useEffect, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  ColorScheme,
  InfoWindow,
  Map as GoogleMapView,
  MapMouseEvent,
  Pin,
  useAdvancedMarkerRef,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation, Search } from 'lucide-react';
import { SiteConfig } from '../types/siteConfig';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

interface AgencyLocationMapProps {
  config: SiteConfig;
  editMode: boolean;
  onChange: (next: SiteConfig) => void;
}

interface SearchResultItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const MapContent: React.FC<AgencyLocationMapProps> = ({
  config,
  editMode,
  onChange,
}) => {
  const { studioMap } = config.contact;
  const placesLib = useMapsLibrary('places');

  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>({
    lat: studioMap.lat,
    lng: studioMap.lng,
  });
  const [cameraZoom, setCameraZoom] = useState<number>(studioMap.zoom);

  useEffect(() => {
    setCameraCenter({ lat: studioMap.lat, lng: studioMap.lng });
  }, [studioMap.lat, studioMap.lng]);

  useEffect(() => {
    setCameraZoom(studioMap.zoom);
  }, [studioMap.zoom]);

  const handleSearchPlaces = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim() || !placesLib) return;

      setSearching(true);
      setSearchError('');
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: searchQuery.trim(),
          fields: ['id', 'displayName', 'formattedAddress', 'location'],
          maxResultCount: 4,
        });

        const mapped: SearchResultItem[] = [];
        for (const place of places) {
          if (place.location) {
            mapped.push({
              id: place.id,
              name: place.displayName || searchQuery.trim(),
              address: place.formattedAddress || '',
              lat: place.location.lat(),
              lng: place.location.lng(),
            });
          }
        }
        setSearchResults(mapped);
        if (mapped.length === 0) {
          setSearchError('No matching locations found.');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSearchError('Unable to search places right now.');
      } finally {
        setSearching(false);
      }
    },
    [placesLib, searchQuery]
  );

  const selectPlace = (item: SearchResultItem) => {
    onChange({
      ...config,
      contact: {
        ...config.contact,
        location: item.address || item.name,
        studioMap: {
          ...config.contact.studioMap,
          studioLabel: item.name,
          lat: item.lat,
          lng: item.lng,
          zoom: 13,
        },
      },
    });
    setSearchResults([]);
    setInfoOpen(true);
  };

  const handleMapClick = (ev: MapMouseEvent) => {
    if (!editMode || !ev.detail.latLng) return;
    onChange({
      ...config,
      contact: {
        ...config.contact,
        studioMap: {
          ...config.contact.studioMap,
          lat: Number(ev.detail.latLng.lat.toFixed(5)),
          lng: Number(ev.detail.latLng.lng.toFixed(5)),
        },
      },
    });
    setInfoOpen(true);
  };

  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${studioMap.lat},${studioMap.lng}`
  )}`;

  return (
    <div className="space-y-4">
      {/* Studio Search Toolbar (Active for finding city/office on map) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form
          onSubmit={handleSearchPlaces}
          className="relative flex-1 max-w-md flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                editMode
                  ? 'Search city or office to move studio pin...'
                  : 'Search city or landmark on map...'
              }
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-400"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !placesLib}
            className="px-4 py-2 rounded-xl bg-violet-600/85 hover:bg-violet-500 disabled:opacity-50 text-xs font-semibold text-white transition-colors whitespace-nowrap"
          >
            {searching ? 'Finding...' : 'Find Place'}
          </button>
        </form>

        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-white transition-colors whitespace-nowrap"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {searchError && <p className="text-xs text-rose-300">{searchError}</p>}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {searchResults.map((res) => (
            <button
              key={res.id}
              type="button"
              onClick={() => selectPlace(res)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.04] hover:bg-violet-600/25 border border-white/15 text-left transition-colors"
            >
              <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {res.name}
                </div>
                {res.address && (
                  <div className="text-[11px] text-slate-400 truncate">
                    {res.address}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Explicit Height Container so Map Never Collapses (CF2) */}
      <div className="relative w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden border border-violet-400/30 shadow-[0_18px_60px_rgba(15,10,45,0.75)]">
        <GoogleMapView
          mapId="DEMO_MAP_ID"
          colorScheme={ColorScheme.DARK}
          center={cameraCenter}
          zoom={cameraZoom}
          onCameraChanged={(ev) => {
            setCameraCenter(ev.detail.center);
            setCameraZoom(ev.detail.zoom);
          }}
          onClick={handleMapClick}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker
            ref={markerRef}
            position={{ lat: studioMap.lat, lng: studioMap.lng }}
            onClick={() => setInfoOpen((prev) => !prev)}
            title={studioMap.studioLabel}
          >
            <Pin
              background={config.theme.primaryPurple}
              borderColor={config.theme.primaryBlue}
              glyphColor="#ffffff"
              scale={1.15}
            />
          </AdvancedMarker>

          {infoOpen && marker && (
            <InfoWindow
              anchor={marker}
              maxWidth={240}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div className="text-slate-900 p-1 space-y-1">
                <div className="font-semibold text-sm leading-tight">
                  {studioMap.studioLabel}
                </div>
                <div className="text-xs text-slate-600">
                  {config.contact.location}
                </div>
                <div className="text-[11px] text-slate-500">
                  {config.contact.email}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMapView>

        {editMode && (
          <div className="pointer-events-none absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#07051a]/90 border border-violet-400/40 text-[11px] text-violet-100">
            Edit Mode: Click anywhere on the map or search above to move your studio pin
          </div>
        )}
      </div>
    </div>
  );
};

export const AgencyLocationMap: React.FC<AgencyLocationMapProps> = (props) => {
  if (!MAPS_API_KEY) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center space-y-2">
        <MapPin className="w-6 h-6 text-violet-400 mx-auto" />
        <p className="text-sm font-semibold text-white">
          Google Maps Studio Location
        </p>
        <p className="text-xs text-slate-400">
          {props.config.contact.studioMap.studioLabel} ·{' '}
          {props.config.contact.location}
        </p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={MAPS_API_KEY}
      libraries={['marker', 'places']}
      language="en"
      region="AE"
    >
      <MapContent {...props} />
    </APIProvider>
  );
};
