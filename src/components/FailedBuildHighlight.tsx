import * as React from "react";
import { Panel, Label } from "react-bootstrap";
import { BuildDetails } from "../reducers"

declare const conf : { failurePictures: string[], successPictures: string[] };

interface FailedBuildHighlightProps {
  id: string;
  name: string;
  picture: string;
  brokenTimeInMin: number,
  numberAttemptsToFix: number,
  messageOfFirstBrokenBuild: string
}


export default ({ id, name, numberAttemptsToFix, brokenTimeInMin, picture }: FailedBuildHighlightProps) => {
    const header = `${name} (${id})`
    const bigMsg = (numberAttemptsToFix > 1) 
      ? `${name} is still broken (${numberAttemptsToFix} uncesseful attempts to repair it)` 
      : name;
    const durationSection = (brokenTimeInMin > 1) 
      ? <h3>Broken for <Label bsStyle="danger">{brokenTimeInMin}</Label> minutes</h3>
      : <h3>Build has just been broken</h3>
      
    return (
          <Panel header={header} bsStyle="danger" bsSize="large">
            <img src={picture} />
            <h2>{bigMsg}</h2>
            <p>{durationSection}</p>
            <p>Build broken in the first place by: TODO</p>
          </Panel>  
        );
}