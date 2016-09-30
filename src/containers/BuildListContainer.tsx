import * as React from "react";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import { AppState, getSuccessfulBuilds, getFailedBuilds } from "../reducers";
import { BuildShortDescription } from "../byId";
import BuildList from "../components/BuildList"

interface BuildListContainerProps {
    failedBuilds: BuildShortDescription[],
    successfulBuilds: BuildShortDescription[]
} 

export const BuildListContainer = ({ failedBuilds, successfulBuilds }: BuildListContainerProps) => {
  const nbBuilds = failedBuilds.length + successfulBuilds.length;
  return (
    <Panel header={"Builds (" + nbBuilds + ")"} >
        <BuildList builds={failedBuilds} healthy={false} />
        <BuildList builds={successfulBuilds} healthy={true} />
    </Panel>
  );
}  

const mapStateToProps = (state: AppState): BuildListContainerProps => (
  { 
    failedBuilds: getFailedBuilds(state),
    successfulBuilds: getSuccessfulBuilds(state),
  }
);

// hack to avoid putting every props optionnal
export default connect(mapStateToProps)(
  (props: any) => BuildListContainer(props as BuildListContainerProps)
);
