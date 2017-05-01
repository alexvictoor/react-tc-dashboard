import * as React from "react";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { connect } from "react-redux";
import { AppState, BuildDetails, getBuildHighlight } from "../reducers";
import { RepairedBuildHighlight, FailedBuildHighlight, AllBuildsGreenHighlight } from "../components"


declare function require(name: string): any
const { 
  Shake 
} = require("reshake");


type BuildHightlightContainerProps = BuildDetails; 


declare const conf : { failurePictures: string[], successPictures: string[] };


export const BuildHighlightContainer = (
  { 
    id,
    name, 
    healthy,
    brokenTimeInMin,
    numberAttemptsToFix,
    messageOfFirstBrokenBuild,
    timeBeingGreenInMin 
  }
  : BuildHightlightContainerProps ) => {

  const pictures = healthy ? conf.successPictures : conf.failurePictures;
  const picture =  pictures[Math.floor(Math.random() * pictures.length)];
 
  let highlight: any;
  if (healthy) {
    if (name === "ALL") {
      return <AllBuildsGreenHighlight picture={picture} minutes={timeBeingGreenInMin as number} />
    }
    return <RepairedBuildHighlight name={name} picture={picture} />
  }
  
  return (
    <Shake fixed={true} >
      <FailedBuildHighlight 
        id={id as string}
        name={name}
        brokenTimeInMin={brokenTimeInMin as number}
        numberAttemptsToFix={numberAttemptsToFix as number}
        picture={picture}
        messageOfFirstBrokenBuild={messageOfFirstBrokenBuild as string}
      />
    </Shake>
  );
}  

// hack to avoid putting every props optionnal
export default connect(getBuildHighlight)(
  ((props: any) => BuildHighlightContainer(props as BuildHightlightContainerProps))
);