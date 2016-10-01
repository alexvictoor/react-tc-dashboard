import * as React from "react";
import { Panel } from "react-bootstrap";
import MediaHighlight from "./MediaHighlight";

interface RepairedBuildHighlightProps {
  name: string;
  picture: string;
}

export default ({ name, picture }: RepairedBuildHighlightProps) => {
   
     return (
          <Panel header={name} bsStyle="success" >
            <MediaHighlight picture={picture} />
            <h2>{name} has been repaired!</h2>
          </Panel>  
        );
}