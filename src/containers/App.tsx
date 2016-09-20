import * as React from "react";
import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import BuildListContainer from "./BuildListContainer";
import BuildHighlightContainer from "./BuildHighlightContainer"

interface AppProps {
  status?: string;
}


const App = ({ status }: AppProps) => {
  if (status) {
    return <div>{status}</div>
  }
  return (
    <div>
      <Grid>
        <PageHeader cellPadding={10} marginWidth={10} >TeamCity Builds status</PageHeader>
        <Row className="show-grid">
          <Col xs={12} md={8}>
              <BuildHighlightContainer />
          </Col> 
          <Col xs={6} md={4}>
              <BuildListContainer /> 
          </Col>    
        </Row>
      </Grid>
      <p>
          TODO footer
      </p>
    </div>
  )
}


const mapStateToProps = (state: AppState) : AppProps => { 
  if (!state.buildsToDisplay.buildToShowId) {
    console.log("init ok");
    return { status: "Init in progress" };
  } 
  console.log("init done alreaady", state);
  return {};
}


export default connect(mapStateToProps)(App)