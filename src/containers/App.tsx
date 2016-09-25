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
          <Col md={6}>
              <BuildHighlightContainer />
          </Col> 
          <Col md={6}>
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
  if (state.byId === {}) {
    return { status: "Init in progress" };
  } 
  return {};
}


export default connect(mapStateToProps)(App)