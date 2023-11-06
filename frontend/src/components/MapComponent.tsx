import { useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { Box, Center } from '@chakra-ui/react';
import { useAppDispatch } from '../hooks';
import { setAddress } from '../features/formSlice'; 

export default function MapComponent() {
  const [coords, setCoords] = useState([55.751574, 37.573856]);
  const apiKey = 'ba8d249a-d94d-4173-af37-e5e8044349ac'

  const dispatch = useAppDispatch()

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
      dispatch(setAddress(data["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["Address"]["formatted"]))
    })
  }

  return (
    <Box mt={5}>
      <Center>
        <YMaps query={{ apikey: apiKey }}>
          <Map defaultState={defaultState} onClick={onMapClick}>
          {/* width='100%' height='100%' */}
            <Placemark geometry={coords}/>
          </Map>
        </YMaps>
      </Center>
    </Box>
  );
}