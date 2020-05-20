import axios from 'axios';

const CancelToken = axios.CancelToken;

class OsmApi {
    constructor () {
        this.requestSource = null;
    }
    search (data = {}) {
        if (this.requestSource) {
            this.requestSource.cancel();
        }
        this.requestSource = CancelToken.source();
        console.log(data.input);
        (data.input) = (data.input).replace(/ /g, '+');
        (data.input).toLowercase;
        let url = `https://nominatim.openstreetmap.org/?format=json&q=${data.input}&addresstype=place&addressdetails=1&countrycodes=jo`; // &countrycodes=ar
        if (data.country) {
            url += '&countrycodes=' + data.country;
        }
        return axios.get(url, { cancelToken: this.requestSource.token }).then((result) => {
            if (result.status === 200) {
                return Promise.resolve(result.data);
            } else {
                console.log('osm api error then', result);
                return Promise.reject(result);
            }
        }).catch((err) => {
            console.log('osm api error', axios.isCancel(err));
        });
    }
    route (data = {}) {
        let url = `https://router.project-osrm.org/route/v1/driving/${data.origin.lng},${data.origin.lat};${data.destiny.lng},${data.destiny.lat}?overview=false&alternatives=true&steps=true&hints=`; // &countrycodes=ar
        return axios.get(url).then((result) => {
            if (result.status === 200) {
                return Promise.resolve(result.data);
            } else {
                return Promise.reject(result);
            }
        });
    }
}

export { OsmApi as default };
