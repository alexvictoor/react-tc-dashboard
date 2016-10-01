import * as React from "react";
import { Panel, Label } from "react-bootstrap";
import { BuildDetails } from "../reducers";
import Duration from "./Duration";
import MediaHighlight from "./MediaHighlight";

interface FailedBuildHighlightProps {
  id: string;
  name: string;
  picture: string;
  brokenTimeInMin: number,
  numberAttemptsToFix: number,
  messageOfFirstBrokenBuild: string
}


export default (
  { 
    id, 
    name, 
    numberAttemptsToFix, 
    brokenTimeInMin, 
    picture, 
    messageOfFirstBrokenBuild 
  }: FailedBuildHighlightProps) => {
    
    const header = `${name} (${id})`
    const bigMsg = (numberAttemptsToFix > 1) 
      ? `${name} is still broken (${numberAttemptsToFix} uncesseful attempts to repair it)` 
      : name;
    const durationSection = (brokenTimeInMin > 1) 
      ? <h3>Broken <Duration minutes={brokenTimeInMin} bsStyle="danger" /></h3>
      : <h3>Build has just been broken</h3>
      
    return (
          <Panel header={header} bsStyle="danger" bsSize="large">
            <MediaHighlight picture={picture} />
            <h2>{bigMsg}</h2>
            {durationSection}
            <p>Build broken with following message: {messageOfFirstBrokenBuild}</p>
          </Panel>  
        );
}