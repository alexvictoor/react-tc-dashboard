import * as React from "react";
import { Panel, Media } from "react-bootstrap";
import { BuildDetails } from "../reducers"

declare const conf : { failurePictures: string[], successPictures: string[] };

interface FailedBuildHighlightProps {
  name: string;
  picture: string;
  brokenTimeInMin: number,
  numberAttemptsToFix: number,
  messageOfFirstBrokenBuild: string
}


export default ({ name, numberAttemptsToFix, brokenTimeInMin, picture }: FailedBuildHighlightProps) => {
    //const pictures = healthy ? conf.successPictures : conf.failurePictures;
    //const picture =  pictures[Math.floor(Math.random()*pictures.length)];        
    //const message = healthy ? `${name} has succeed!` : `${name} has failed!`;
    const bigMsg = (numberAttemptsToFix > 1) 
      ? `${name} is still broken (${numberAttemptsToFix} uncesseful attempts to repair it)` 
      : name;
    return (
          <Panel header={name} bsStyle="danger" >
            <img src={picture} />
            <h2>{bigMsg}</h2>
            <p>Broken for {brokenTimeInMin} minutes</p>
            <p>Build broken in the first place by: TODO</p>
          </Panel>  
        );
}