import * as React from "react";
import { Panel } from "react-bootstrap";
import MediaHighlight from "./MediaHighlight";
import Duration from "./Duration";

interface Props {
  picture: string;
  minutes: number;
}

export default ({picture, minutes}: Props) => {
   
     return (
          <Panel header={name} bsStyle="success" >
            <MediaHighlight picture={picture} />
            <h2>All builds are green \o/</h2>
            <p>(<Duration minutes={minutes} bsStyle="success" threshold={600} />)</p>
          </Panel>  
        );
}