import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElement/Modal";
import Map from "../../shared/components/UIElement/Map";
import { useHTTPRequest } from "../../shared/hooks/http-hook";
import AuthContext from "../../shared/context/auth-context";
import "./PlaceItem.css";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

const PlaceItem = (props) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendRequest, isLoading, errorMessage, clearError] = useHTTPRequest();
  const auth = useContext(AuthContext);

  const openMapHandler = () => setIsMapOpen(true);

  const closeMapHandler = () => setIsMapOpen(false);

  const openConfirmModal = () => setShowConfirmModal(true);

  const closeConfirmModal = () => setShowConfirmModal(false);

  const onDeletePlace = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      <Modal
        show={isMapOpen}
        onCancel={closeMapHandler}
        header="Map"
        contentClass="place-item__modal-content"
        footerClass="place-item__model-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="modal-container">
          <Map center={props.coordinates} zoom={18} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={closeConfirmModal}
        header="Are You Sure"
        contentClass="place-item__modal-content"
        footerClass="place-item__model-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmModal}>
              Cancel
            </Button>
            <Button danger onClick={onDeletePlace}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        Do You really want to delete this item? Changes are irreversible
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.isLoggedIn && props.creatorId === auth.userId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.isLoggedIn && props.creatorId === auth.userId && (
              <Button danger onClick={openConfirmModal}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
