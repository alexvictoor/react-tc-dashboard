import * as React from "react";
import { Panel, Media } from "react-bootstrap";
import { BuildDetails } from "../reducers"

declare const conf : { failurePictures: string[], successPictures: string[] };

export default ({ healthy, name, numberOfAttemptsToFix, brokenTimeInMin }: BuildDetails) => {
    const pictures = healthy ? conf.successPictures : conf.failurePictures;
    const picture =  pictures[Math.floor(Math.random()*pictures.length)];        
    const message = healthy ? `${name} has succeed!` : `${name} has failed!`;
     return (
          <Panel header="Build name blbla" bsStyle="danger" >
            <img src={picture} />
            <h2>{message }</h2>
            <p>Broken for {brokenTimeInMin} minutes ({numberOfAttemptsToFix} uncesseful attempts to repair it)</p>
            <p>Build broken in the first place by: TODO</p>
          </Panel>  
        );
}