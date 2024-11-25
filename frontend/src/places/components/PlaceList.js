import React, { useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const PlaceList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter places based on the search term
  const filteredPlaces = props.items.filter((place) =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update the search term state on input change
  const searchChangeHandler = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <React.Fragment>
      {/* Search Input */}
      <div className="place-list__filter">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={searchChangeHandler}
        />
      </div>

      {/* Render "Search Not Found" message if there are no matches for the search */}
      {filteredPlaces.length === 0 && searchTerm.trim().length > 0 && (
        <div className="place-list center">
          <Card>
            <h2>Search Not Found</h2>
          </Card>
        </div>
      )}

      {/* Render "No places found" message with "Share Place" button if no places are available at all */}
      {filteredPlaces.length === 0 && searchTerm.trim().length === 0 && (
        <div className="place-list center">
          <Card>
            <h2>No places found. Maybe create one?</h2>
            <Button to="/places/new">Share Place</Button>
          </Card>
        </div>
      )}

      {/* Render the list of places if there are matches */}
      {filteredPlaces.length > 0 && (
        <ul className="place-list">
          {filteredPlaces.map((place) => (
            <PlaceItem
              key={place.id}
              id={place.id}
              image={place.image}
              title={place.title}
              description={place.description}
              address={place.address}
              creatorId={place.creator}
              coordinates={place.location}
              onDelete={props.onDeletePlace}
            />
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default PlaceList;
