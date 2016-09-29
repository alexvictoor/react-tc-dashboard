import * as React from "react";
import { ListGroup, ListGroupItem, Label  } from "react-bootstrap";
import { BuildShortDescription } from "../build-status-reducers"
import Duration from "./Duration";

interface BuildListProps {
    builds: BuildShortDescription[], 
    healthy: boolean
}

export default ({ healthy, builds }: BuildListProps) => {
  
  const cssClass = healthy ? "success" : "danger";
  const threshold = healthy ? 10 * 60 * 24 : 10;

  const buildItems = builds.map(build => {
    const header = <div>{build.name} (<Duration minutes={build.minutesSinceBuild} threshold={threshold} />)</div>
    return (
      <ListGroupItem 
        key={build.id} 
        bsStyle={cssClass} 
        header={header}>
        {build.id}
      </ListGroupItem>
    )
  });
  
  return (
      <ListGroup>
        {buildItems}
      </ListGroup>
  );
}  