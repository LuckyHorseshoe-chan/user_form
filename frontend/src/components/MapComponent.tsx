import { useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function MapComponent() {
  const [coords, setCoords] = useState([55.751574, 37.573856]);
  const apiKey = 'ba8d249a-d94d-4173-af37-e5e8044349ac'

  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };

  function onMapClick(e: any){
    setCoords(e.get("coords"))
    console.log(coords)
    fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${coords[1]},${coords[0]}&lang=ru_RU&format=json`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["Address"]["formatted"])
    })
  }

  return (
    <YMaps query={{ apikey: apiKey }}>
      <Map defaultState={defaultState} onClick={onMapClick}>
        {/* <Placemark geometry={coords}
        properties={
          {
            balloonHeader: 'Заголовок балуна',
            balloonContent: 'Контент балуна',
            balloonFooter: 'Футер балуна',
            balloonShadow: true,
            balloonPanelMaxMapArea: 1
          }
        }/> */}
      </Map>
    </YMaps>
  );
}