import * as React from "react";
import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import BuildListContainer from "./BuildListContainer";
import BuildHighlightContainer from "./BuildHighlightContainer"


declare const conf: {highlightSize: number, buildListSize: number};

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
          <Col md={conf.highlightSize}>
              <BuildHighlightContainer />
          </Col> 
          <Col md={conf.buildListSize}>
              <BuildListContainer /> 
          </Col>    
        </Row>
      </Grid>
      <p>
          <a href="https://github.com/alexvictoor/react-tc-dashboard">Fork me!</a>
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