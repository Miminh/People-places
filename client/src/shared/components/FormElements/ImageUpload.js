import React, { useRef, useState, useEffect } from "react";

import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewFile, setPreviewFile] = useState();
  const [isValid, setIsValid] = useState(false);

  const imagePickerRef = useRef();

  const pickHandler = () => {
    imagePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewFile(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const imagePickedHandler = (event) => {
    let pickedFile;
    let fileisValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileisValid = true;
    } else {
      setIsValid(false);
      fileisValid = false;
    }
    props.onInput(props.id, pickedFile, fileisValid);
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        ref={imagePickerRef}
        type="file"
        accept=".jpeg, .png, .jpg"
        onChange={imagePickedHandler}
      />
      <div className="image-upload">
        <div className={`image-upload__preview ${props.center && "center"}`}>
          {previewFile && (
            <img
              src={props.initialImage ? props.initialImage : previewFile}
              alt="Preview"
            />
          )}
          {!previewFile && <p>Upload an Image</p>}
        </div>
        <Button type="button" onClick={pickHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && props.errorMessage}
    </div>
  );
};

export default ImageUpload;
