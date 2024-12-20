import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode

  const toggleExpandHandler = () => {
    setIsExpanded(prevState => !prevState); // Toggle between expanded and normal view
  };

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className={`place-item ${isExpanded ? 'expanded' : ''}`}>
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.description}</h3>
            <p><strong>Email:</strong> {props.email || 'N/A'}</p>
            {isExpanded && (
              <div className="place-item__details">
                <p><strong>Address:</strong>{props.address}</p>
                <p><strong>Contact:</strong> {props.contact || 'N/A'}</p>
                <p><strong>LinkedIn:</strong> <a href={props.linkedin || '#'} target="_blank" rel="noopener noreferrer">{props.linkedin || 'N/A'}</a></p>
                <p><strong>Additional Notes:</strong> {props.notes || 'N/A'}</p>
              </div>
            )}
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={toggleExpandHandler}>
              {isExpanded ? 'SHOW LESS' : 'VIEW MORE'}
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={confirmDeleteHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
