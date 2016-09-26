import * as React from "react";
import { ListGroup, ListGroupItem, Label  } from "react-bootstrap";
import { BuildShortDescription } from "../build-status-reducers"
import Duration from "./Duration";

interface BuildListProps {
    builds: BuildShortDescription[], 
    cssClass: string
}

export default ({ cssClass, builds }: BuildListProps) => {
  
  const buildItems = builds.map(build => {
    const header = <div>{build.name} (<Duration minutes={build.minutesSinceBuild} />)</div>
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