import * as React from "react";
import { Panel } from "react-bootstrap";

interface Props {
  picture: string;
}

export default ({picture}: Props) => {
   
     return (
          <Panel header={name} bsStyle="success" >
            <img src={picture} />
            <h2>All builds are green \o/</h2>
          </Panel>  
        );
}