class MapsService {
  constructor() {
    this.mapsApiKey = process.env.MAPS_API_KEY || '';
  }

  /**
   * Get embed URL for interactive map
   */
  getEmbedMapUrl(query, lat, lng) {
    if (this.mapsApiKey && lat && lng) {
      return `https://www.google.com/maps/embed/v1/place?key=${this.mapsApiKey}&q=${lat},${lng}&zoom=12`;
    }
    // OpenStreetMap free interactive embed (zero API key dependency)
    const encoded = encodeURIComponent(query || 'Goa, India');
    return `https://maps.google.com/maps?q=${encoded}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }
}

export default new MapsService();
