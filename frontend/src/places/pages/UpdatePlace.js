import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
      contactNumber: { value: '', isValid: false },
      address: { value: '', isValid: false },
      image: { value: null, isValid: false },
      linkedIn: { value: '', isValid: false }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: { value: responseData.place.title, isValid: true },
            description: { value: responseData.place.description, isValid: true },
            contactNumber: { value: responseData.place.contactNumber, isValid: true },
            address: { value: responseData.place.address, isValid: true },
            image: { value: responseData.place.image, isValid: true },
            linkedIn: { value: responseData.place.linkedIn, isValid: true }
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('contactNumber', formState.inputs.contactNumber.value);
      formData.append('address', formState.inputs.address.value);
      if (formState.inputs.image.value) {
        formData.append('image', formState.inputs.image.value);
      }
      formData.append('linkedIn', formState.inputs.linkedIn.value);

      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        formData,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Student Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Placed Company"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Input
            id="contactNumber"
            element="input"
            type="text"
            label="Contact Number"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid contact number."
            onInput={inputHandler}
            initialValue={loadedPlace.contactNumber}
            initialValid={true}
          />
          <Input
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={inputHandler}
            initialValue={loadedPlace.address}
            initialValid={true}
          />
          <ImageUpload
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
          <Input
            id="linkedIn"
            element="input"
            type="url"
            label="LinkedIn Link"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid LinkedIn profile link."
            onInput={inputHandler}
            initialValue={loadedPlace.linkedIn}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE Student
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
