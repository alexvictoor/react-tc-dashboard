import * as React from "react";
import { ListGroup, ListGroupItem, Label  } from "react-bootstrap";
import { BuildShortDescription } from "../build-status-reducers"

interface BuildListProps {
    builds: BuildShortDescription[], 
    cssClass: string
}

export default ({ cssClass, builds }: BuildListProps) => {
  const buildItems = builds.map(build => (
    <ListGroupItem key={build.id} bsStyle={cssClass} header={build.name}>{build.id} <Label>{build.minutesSinceBuild}m</Label></ListGroupItem>
  ));
  return (
      <ListGroup>
        {buildItems}
      </ListGroup>
  );
}  