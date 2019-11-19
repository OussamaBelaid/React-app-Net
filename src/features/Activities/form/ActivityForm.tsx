import React, { useState,useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import {
  ActivityFormValues
} from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { Form as FinalForm, Field } from "react-final-form";
import { TextInput } from "../../../app/common/form/TextInput";
import { TextAreaInput } from "../../../app/common/form/TextAreaInput";
import { SelectInput } from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/form/options/CategoryOptions";
import { DateInput } from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate'
import { RootStoreContext } from "../../../app/stores/routeStore";

const validate = combineValidators({
  title: isRequired({message:'The event title is required'}),
  category:isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message:'Description needs to be at least 5 characters'})
  )(),
  city: isRequired('City'),
  venue:isRequired('Venue'),
  date:isRequired('Date'),
  time:isRequired('Time')
})

interface DetailPrams {
  id: string;
}

export const ActivityForm: React.FC<RouteComponentProps<DetailPrams>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,

    loadActivity,

  } = rootStore.activityStore;


  const [Activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(activity => setActivity(new ActivityFormValues(activity)))

        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...Activity } = values;
    Activity.date = dateAndTime;
    if (!Activity.id) {
      let newActivity = {
        ...Activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(Activity);
    }
  };

  return (
    <Grid>
      <Grid.Column>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={Activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit,invalid,pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder="Title"
                  name="title"
                  value={Activity.title}
                  component={TextInput}
                />
                <Field
                  rows={3}
                  name="description"
                  placeholder="Description"
                  value={Activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  options={category}
                  name="category"
                  value={Activity.category}
                  component={SelectInput}
                />
                <Form.Group widths="equal">
                  <Field
                    placeholder="Date"
                    name="date"
                    date={true}
                    value={Activity.date}
                    component={DateInput}
                  />
                  <Field
                    placeholder="Date"
                    name="time"
                    time={true}
                    value={Activity.time}
                    component={DateInput}
                  />
                </Form.Group>

                <Field
                  placeholder="City"
                  name="city"
                  value={Activity.city}
                  component={TextInput}
                />
                <Field
                  placeholder="Venue"
                  name="venue"
                  value={Activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={
                    Activity.id
                      ? () => history.push(`/activities/${Activity.id}`)
                      : () => history.push("/activities")
                  }
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
