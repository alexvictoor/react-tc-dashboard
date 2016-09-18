import * as React from "react";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import { AppState, BuildDetails, getBuildHighlight } from "../reducers";
import RepairedBuildHighlight from "../components/RepairedBuildHighlight"
import FailedBuildHighlight from "../components/FailedBuildHighlight"


//type BuildHightlightContainerProps = BuildDetails; 
export interface BuildHightlightContainerProps {
  name?: string,
  healthy?: boolean,
  brokenTimeInMin?: number,
  numberAttemptsToFix?: number,
  messageOfFirstBrokenBuild?: string
}

declare const conf : { failurePictures: string[], successPictures: string[] };


export const BuildHighlightContainer = (
  { 
    name, 
    healthy,
    brokenTimeInMin,
    numberAttemptsToFix 
  }
  : BuildHightlightContainerProps ) => {
 
  const pictures = healthy ? conf.successPictures : conf.failurePictures;
  const picture =  pictures[Math.floor(Math.random() * pictures.length)];
 
  let highlight: any;
  if (healthy) {
    return <RepairedBuildHighlight name={name} picture={picture} />
  }
  
  return (
    <FailedBuildHighlight 
      name={name}
      brokenTimeInMin={brokenTimeInMin}
      numberAttemptsToFix={numberAttemptsToFix}
      picture={picture}
      messageOfFirstBrokenBuild="TODO"
    />
  );
}  

/*
export const mapStateToProps = (state : AppState) : BuildHightlightContainerProps => (
  getBuildHighlight(state)
);
*/


export default connect(getBuildHighlight)((BuildHighlightContainer))