import React, { Component } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from "react-sortable-hoc";
import Sort from "../components/Sort.css";

/* PROPS:
    initialValues: [string]; the values to be displayed in their original order
    updateParent: function; when a sort ends, update parent component as needed
*/

/* STATE:
    currentValues: [string]; the values from this.props.initialValues re-ordered as needed
*/

const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want

const SortableItem = SortableElement(({ value }) => {
  return (
    <li>
      <DragHandle />
      {value}
    </li>
  );
});

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((value, index) =>
        <SortableItem key={`item-${index}`} index={index} value={value} />
      )}
    </ul>
  );
});

export default class SortableTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValues: this.props.initialValues
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let values = this.state.currentValues;
    this.props.updateParent(oldIndex, newIndex);
    this.setState({
      currentValues: arrayMove(values, oldIndex, newIndex)
    });
  };

  render() {
    let values = this.state.currentValues;

    return (
      <SortableList
        items={values}
        onSortEnd={this.onSortEnd}
        useDragHandle={true}
      />
    );
  }
}
