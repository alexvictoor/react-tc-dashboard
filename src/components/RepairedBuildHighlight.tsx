import * as React from "react";
import { Panel } from "react-bootstrap";

interface RepairedBuildHighlightProps {
  name: string;
  picture: string;
}

export default ({ name, picture }: RepairedBuildHighlightProps) => {
   
     return (
          <Panel header={name} bsStyle="success" >
            <img src={picture} />
            <h2>{name} has been repaired!</h2>
          </Panel>  
        );
}