import * as React from "react";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import { AppState, getSuccessfulBuilds, getFailedBuilds } from "../reducers";
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


const mapStateToProps = (state: AppState): any => (
  { 
    failedBuilds: getFailedBuilds(state),
    successfulBuilds: getSuccessfulBuilds(state),
    highlightBuild: ""
  }
);

// hack to avoid putting every props optionnal
export default connect(mapStateToProps)(
  (props: any) => BuildListContainer(props as BuildListContainerProps)
);
