import { useReducer, useCallback} from 'react';

const formAction = (state, action) => {
    switch(action.type){
      case "INPUT_CHANGE" : 
        let formIsValid = true;
        for(let inputId in state.inputs){
          if(!state.inputs[inputId]){
            continue;
          }
          if(inputId === action.inputId ){
            formIsValid = formIsValid && action.isValid;
          }
          else{
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return{
          ...state,
          inputs : {
            ...state.inputs,
            [action.inputId] : {value : action.value, isValid : action.isValid},
          },
          isValid : formIsValid
        }

      case "SET_DATA" : 
        return {
          ...state,
          inputs : action.data,
          isValid : action.formIsValid
        }
        default : 
          return state;
    }
  };
  

export const useForm = (initial, initialIsValid) => {
    const [formState, dispatch] = useReducer(formAction, {
        inputs: initial,
        isValid: initialIsValid,
      });
    
      const inputChangeHandler = useCallback((id, value, isValid) => {
        dispatch({
          type : "INPUT_CHANGE",
          value : value,
          isValid : isValid,
          inputId : id
        });
      }, []);

      const setFormData = useCallback((data, validity) => {
        dispatch({
          type : "SET_DATA",
          data : data,
          formIsValid : validity
        })
      }, [])

      return [formState, inputChangeHandler, setFormData];
};