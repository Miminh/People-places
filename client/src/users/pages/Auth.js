import React, { useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Card from "../../shared/components/UIElement/Card";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { useHTTPRequest } from "../../shared/hooks/http-hook";
import "./Auth.css";
import AuthContext from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [sendRequest, isLoading, errorMessage, clearMessage] = useHTTPRequest();

  const auth = useContext(AuthContext);
  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(response.userId, response.token);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        auth.login(response.userId, response.token);
      } catch (error) {}
    }
  };

  const switchHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      {errorMessage && (
        <ErrorModal error={errorMessage} onClear={clearMessage} />
      )}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>User Login</h2>
        <hr />
        <form onSubmit={onSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              label="User Name"
              type="text"
              placeholder="User name"
              onInput={inputChangeHandler}
              errorMessage="Please enter a valid Mail Address"
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          {!isLoginMode && (
            <ImageUpload id="image" center onInput={inputChangeHandler} />
          )}
          <Input
            id="email"
            element="input"
            label="Email"
            type="email"
            placeholder="Email"
            onInput={inputChangeHandler}
            errorMessage="Please enter a valid Mail Address"
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input
            id="password"
            element="input"
            label="Password"
            type="password"
            onInput={inputChangeHandler}
            placeholder="Password"
            errorMessage="Please enter a valid Password (Minimum of 7 characters)"
            validators={[VALIDATOR_MINLENGTH(7)]}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button inverse onClick={switchHandler}>
          Switch to {isLoginMode ? "Sign Up" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
