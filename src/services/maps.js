export function deg2rad (deg) {
    return deg * (Math.PI / 180);
}

export function pointDistance (lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000.0; // Distance in km
    return isNaN(d) ? 1000 : d;
}

export function parseStreet (result) {
    var address = {};
    for (var i in result.address_components) {
        var obj = result.address_components[i];
        var longname = obj.long_name;
        var shortname = obj.short_name;
        switch (obj.types[0]) {
        case 'country':
            address.country = longname;
            break;
        case 'administrative_area_level_1':
            address.province = shortname.replace('province of ', '');
            break;
        case 'locality':
            address.city = longname.replace('City of ', '');
            break;
        case 'route':
            address.street = longname;
            break;
        case 'street_number':
            address.number = longname;
            break;
        };
    }
    return address;
};

export function parseOsmStreet (result) {
    var address = {};
    address.country = result.address.country;
    address.province = result.address.state.replace('Province of ', '');
    let city = '';
    city = result.address[result.type] ? result.address[result.type] : (result.address.county ? result.address.county : result.address.city);
    city.replace('City of', '');
    city.replace('Municipality of ', '');
    address.city = city;
    address.Street = '';
    address.number = '';

    return address;
};
