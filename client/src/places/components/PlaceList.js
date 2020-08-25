import React from "react";

import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <div>No Places are Available, would you like to Share one</div>
          <Button to={"/places/new"}>Share Places</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          title={place.title}
          description={place.description}
          image={place.image}
          address={place.address}
          coordinates={place.location}
          creatorId={place.creator}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
