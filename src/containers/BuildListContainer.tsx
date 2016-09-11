import * as React from "react";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import { AppState, getSuccessfulBuildNames, getFailedBuildNames } from "../reducers";
import BuildList from "../components/BuildList"

interface BuildListContainerProps {
    failedBuilds: string[],
    successfulBuilds: string[]
}

const BuildListContainer = ({ failedBuilds, successfulBuilds }: any) => {
  return (
    <Panel header="Builds">
        <BuildList builds={failedBuilds} cssClass="danger" />
        <BuildList builds={successfulBuilds} cssClass="success" />
    </Panel>
  );
}  


const mapStateToProps = (state : AppState) : any => (
  { 
    failedBuilds: getFailedBuildNames(state),
    successfulBuilds: getSuccessfulBuildNames(state),
    highlightBuild: ""
  }
);


export default connect(mapStateToProps)(BuildListContainer)
