import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import "./PlaceForm.css";
import Button from "../../shared/components/FormElements/Button";
import AuthContext from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHTTPRequest } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = (props) => {
  const auth = useContext(AuthContext);
  const [formState, inputChangeHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  const [sendRequest, isLoading, errorMessage, clearError] = useHTTPRequest();
  const history = useHistory();
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("image", formState.inputs.image.value);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places/",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      <form className="place-form" onSubmit={formSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorMessage="Enter a Valid Title"
          onInput={inputChangeHandler}
          validators={[VALIDATOR_REQUIRE()]}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          errorMessage="Enter a Valid Description(Minimum 5 characters)"
          onInput={inputChangeHandler}
          validators={[VALIDATOR_MINLENGTH(5)]}
        />
        <ImageUpload center id="image" onInput={inputChangeHandler} />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          errorMessage="Enter a Valid Address"
          onInput={inputChangeHandler}
          validators={[VALIDATOR_REQUIRE()]}
        />
        <Button disabled={!formState.isValid}>Add Place</Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
