export const INTERNATIONAL_ZONES = [
  {
    country: "Egypt",
    countryCode: "EG",
    zones: [
      { name: "Nasr City - Abbas El Akkad", lat: 30.0601, lng: 31.3375 },
      { name: "Heliopolis - Korba", lat: 30.0911, lng: 31.3236 },
      { name: "Maadi - Road 9", lat: 29.9602, lng: 31.2612 },
      { name: "New Cairo - 90 Street", lat: 30.0242, lng: 31.4815 },
      { name: "Sheikh Zayed - Hyper One", lat: 30.0463, lng: 30.9996 },
    ],
  },
  {
    country: "Saudi Arabia",
    countryCode: "SA",
    zones: [
      { name: "Riyadh - Al Olaya", lat: 24.7117, lng: 46.6743 },
      { name: "Riyadh - Hittin", lat: 24.7744, lng: 46.6083 },
      { name: "Jeddah - Al Rawdah", lat: 21.5647, lng: 39.1558 },
      { name: "Jeddah - Al Hamra", lat: 21.517, lng: 39.1672 },
      { name: "Dammam - Al Shatea", lat: 26.4622, lng: 50.1264 },
    ],
  },
] as const;
