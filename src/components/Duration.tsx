import * as React from "react";
import { Label } from "react-bootstrap";


interface Props {
  minutes: number;
  threshold?: number;
  bsStyle?: string;
}

export default ({ minutes, threshold = 10, bsStyle }: Props): React.ReactElement<any> => {
  const lessThanTWo = (minutes < 2);
  const lessThanOneHour = (minutes < 60);
  const lessThanTwoHours = (minutes < 120);
  
  const PassThrough = (props: any) => <span>{props.children}</span>
  const BsLabel = (props: any) => <Label bsStyle={bsStyle} >{props.children}</Label>
  const Container = (minutes < threshold) ? PassThrough : BsLabel;
  
  const result 
    = lessThanTWo ?
      (<span>just now</span>)
      : lessThanOneHour ?
      (<span><Container>{minutes} minutes</Container> ago</span>) 
      : lessThanTwoHours ?
      (<span><Container>1 hour</Container> ago</span>)
      : (<span><Container>{Math.floor(minutes/60)} hours</Container> ago</span>);
  
  return result;
}