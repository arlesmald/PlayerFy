import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';

const AroundYou = () => {
  
    const countriesPermitted =  ["DZ","BY","CI","SN","TN","AU","AT","AZ","AR","BE","BG","BR","GB","HU","VE","VN","GH","DE","GR","DK","EG","ZM","IL","IN","ID","IE","ES","IT","KZ","CM","CA","KE","CN","CO","CR","MY","MA","MX","MZ","NG","NL","NZ","NO","AE","PE","PL","PT","RU","RO","SA","SG","US","TH","TZ","TR","UG","UZ","UA","UY","PH","FI","FR","HR","CZ","CL","CH","SE","ZA","KR","JP"];
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(true);
    const { activeSong, isPlaying } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetSongsByCountryQuery(country);

    useEffect(() => {

        //!trying to make a request with an adblocker in the web browser will throw a network error in axios or fetch 
        axios
        .get(`https://ipapi.co/json/`)
        .then((res) => {
            if(countriesPermitted.includes(res.data.country)){
                console.log('incluye')
                setCountry(res.data.country)
            }else {
                console.log('no incluye');
                setCountry('US')
            }
            })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }, [country])

    if(isFetching && loading) return <Loader title="Loading songs around you" />;

    if(error && country) return <Error />;

  return (
    <div className="flex flex-col">
        <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
          Around You <span className="font-black">{country}</span>
        </h2>

        <div className="flex flex-wrap sm:justify-start justify-center gap-8">
          {data?.map((song, i) => (
            <SongCard 
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
            />
          ))}
        </div>
    </div>
  );
};
export default AroundYou;
