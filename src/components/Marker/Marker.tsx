import closeIcon from '@/assets/icons/cross.svg';
import markerIcon from '@/assets/icons/map-marker.svg';
import { Map, Overlay } from 'ol';
import { FC, useEffect, useRef } from 'react';
import styles from './Marker.module.scss';

interface Marker {
  mapRef: React.MutableRefObject<Map | undefined>;
  position: number[] | undefined;
  title: string;
}

export const Marker: FC<Marker> = ({ mapRef, position, title }) => {
  const markerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const marker = new Overlay({
    element: markerRef.current as HTMLElement,
    positioning: 'bottom-center',
    stopEvent: false,
  });

  const markerPopup = new Overlay({
    element: popupRef.current as HTMLElement,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [-100, -30],
  });

  useEffect(() => {
    mapRef.current?.addOverlay(marker);
    mapRef.current?.addOverlay(markerPopup);

    marker.setPosition(position);

    return () => {
      mapRef.current?.removeOverlay(marker);
      mapRef.current?.removeOverlay(markerPopup);
    };
  }, [mapRef, position]);

  const closePopup = () => {
    markerPopup.setPosition(undefined);
  };

  const openPopup = () => {
    markerPopup.setPosition(position);
  };

  const handleMarkerClick = () => {
    markerPopup.getPosition() ? closePopup() : openPopup();
  };

  const handleCloseButtonClick = () => {
    closePopup();
  };

  return (
    <div className={styles.markerLayout} style={{ display: position ? 'block' : 'none' }}>
      <div ref={popupRef} className={styles.popup}>
        <button className={styles.closeButton} onClick={handleCloseButtonClick}>
          <img src={closeIcon} className={styles.closeIcon} alt={'close'} />
        </button>
        <p className={styles.popupContent}>{title}</p>
      </div>

      <div ref={markerRef} className={styles.marker} onClick={handleMarkerClick}>
        <img src={markerIcon} className={styles.markerIcon} alt={'marker'} />
      </div>
    </div>
  );
};
