import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import { connect } from "react-redux";
import BuildListContainer from "./BuildListContainer";
import BuildHighlight from "../components/BuildHighlight"

interface AppProps {
  foo: string;
  status?: string;
  launch?: () => void
}

class App extends React.Component<AppProps, {}> {
  render() {
    return (
      /*<div>
        <h1>React Router Tutorial {this.props.foo}</h1>
        <ul role="nav">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/repos">Repos</Link></li>
        </ul>
      </div>*/
      <div>
      <Grid>
        <Row className="show-grid">
          <Col xs={6} md={4}>
              <BuildListContainer /> 
          </Col>
          <Col xs={12} md={8}>
              <BuildHighlight name="eee" healthy={false} />
          </Col>     
        </Row>
        
      </Grid>
      <p>
            Appl {this.props.status} <button onClick={ this.props.launch } />
        </p>
  </div>
    )
  }
}

const mapStateToProps = (state) => ({ status: state.status })

const mapDispatchToProps = (dispatch) => ({
  launch: () => dispatch({type: "INIT_ACTION"})  
})

export default connect(mapStateToProps, mapDispatchToProps)(App)