import React, { useState, FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityStore from '../../../app/stores/activityStore';
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
interface IProps {
  Activity: IActivity;
}

export const ActivityForm: React.FC<IProps> = ({
  Activity: initialFormState,
}) => {
  const activityStore = useContext(ActivityStore)
  const {createActivity,editActivity,submitting,cancelFormOpen} = activityStore;
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: ""
      };
    }
  };
  const [Activity, setActivity] = useState<IActivity>(initializeForm);

  const handleSubmit = () => {
    if (Activity.id.length === 0) {
      let newActivity = {
        ...Activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(Activity);
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...Activity, [name]: value });
  };
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          placeholder='Title'
          name='title'
          value={Activity.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          rows={2}
          placeholder='Description'
          name='description'
          value={Activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          placeholder='Category'
          name='category'
          value={Activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          type='datetime-local'
          placeholder='Date'
          name='date'
          value={Activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          placeholder='City'
          name='city'
          value={Activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          placeholder='Venue'
          name='venue'
          value={Activity.venue}
        />
        <Button
          loading={submitting}
          floated='right'
          positive
          type='submit'
          content='Submit'
        />
        <Button
          onClick={() => cancelFormOpen}
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm)
