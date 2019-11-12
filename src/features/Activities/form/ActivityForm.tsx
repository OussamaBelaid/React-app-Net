import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityStore from "../../../app/stores/activityStore";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";

interface DetailPrams {
  id: string;
}

export const ActivityForm: React.FC<RouteComponentProps<DetailPrams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activitie: initialFormState,
    loadActivity,
    clearActivity
  } = activityStore;
  console.log(initialFormState);

  const [Activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: ""
  });
  useEffect(() => {
    if (match.params.id && Activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    Activity.id.length
  ]);
  const handleSubmit = () => {
    if (Activity.id.length === 0) {
      let newActivity = {
        ...Activity,
        id: uuid()
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(Activity).then(() =>
        history.push(`/activities/${Activity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...Activity, [name]: value });
  };
  return (
    <Grid>
      <Grid.Column>
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
              onClick={() => history.push("/activities")}
              floated='right'
              type='button'
              content='Cancel'
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
