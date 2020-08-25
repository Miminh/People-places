import React, { useReducer, useEffect } from "react";

import { validate } from '../../util/validators'
import "./Input.css";

const reducerAction = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH" : 
      return {
          ...state,
          isTouched : true
      }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inState, dispatch] = useReducer(reducerAction, {
    value: props.value || '',
    iTouched : false,
    isValid: props.isValid || false,
  });

  const {id, onInput} = props;
  const {value, isValid} = inState;

  useEffect(()=>{
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid])


  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators : props.validators
    });
  };

  const touchHandler = () => {
      dispatch({
          type : "TOUCH"
      });
  }

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inState.value}
      />
    ) : (
      <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} onBlur={touchHandler} value={inState.value} />
    );

  return (
    <div
      className={`form-control ${!inState.isValid && inState.isTouched && "form-control--invalid"}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inState.isValid && inState.isTouched && <p>{props.errorMessage}</p>}
    </div>
  );
};

export default Input;
