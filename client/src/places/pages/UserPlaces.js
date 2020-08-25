import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHTTPRequest } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
export const USERPLACES = [
  {
    id: "p1",
    title: "Taj Mahal",
    description: "One of the 7 Wonders of the world",
    imageUrl:
      "https://qph.fs.quoracdn.net/main-qimg-aa985d157419b1dee54e6badafa872a7",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    location: {
      lat: 27.1751496,
      lng: 78.0399535,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Taj Mahal 123",
    description: "One of the 7 Wonders of the world",
    imageUrl:
      "https://qph.fs.quoracdn.net/main-qimg-aa985d157419b1dee54e6badafa872a7",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    location: {
      lat: 27.1751496,
      lng: 78.0399535,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().uid;
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [sendRequest, isLoading, errorMessage, clearError] = useHTTPRequest();

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevState) =>
      prevState.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal erro={errorMessage} onClear={clearError} />
      {isLoading && (
        <div className="centered">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
