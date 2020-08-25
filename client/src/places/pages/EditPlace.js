import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import AuthContext from "../../shared/context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHTTPRequest } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElement/Card";
import "./PlaceForm.css";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
//import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const EditPlace = (props) => {
  const [sendRequest, isLoading, errorMessage, clearError] = useHTTPRequest();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const placeId = useParams().placeId;
  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlaces(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
            image: {
              value: responseData.place.image,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, setFormData, setLoadedPlaces, placeId]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("image", formState.inputs.image.value);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/places");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <h1>
          <LoadingSpinner />
        </h1>
      </div>
    );
  }

  if (!isLoading && !loadedPlaces) {
    return (
      <div className="center">
        <Card>
          <h2>No Such Place</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      {!isLoading && loadedPlaces && (
        <form className="place-form" onSubmit={formSubmitHandler}>
          <Input
            id="title"
            label="Title"
            element="input"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorMessage="Enter a valid Title"
            onInput={inputChangeHandler}
            value={loadedPlaces.title}
            isValid={true}
          />
          <Input
            id="description"
            label="Description"
            element="textarea"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorMessage="Enter a valid description (At least 5 Characters)"
            onInput={inputChangeHandler}
            value={loadedPlaces.description}
            isValid={true}
          />
          <Button disabled={!formState.isValid}>Update Place</Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default EditPlace;
