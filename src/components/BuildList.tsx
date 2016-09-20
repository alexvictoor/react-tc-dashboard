import * as React from "react";
import { ListGroup, ListGroupItem  } from "react-bootstrap";
import { BuildId } from "../build-status-reducers"

interface BuildListProps {
    builds: BuildId[], 
    cssClass: string
}

export default ({ cssClass, builds }: BuildListProps) => {
  const buildItems = builds.map(build => (
    <ListGroupItem key={build.id} bsStyle={cssClass} header={build.name}>{build.id}</ListGroupItem>
  ));
  return (
      <ListGroup>
        {buildItems}
      </ListGroup>
  );
}  