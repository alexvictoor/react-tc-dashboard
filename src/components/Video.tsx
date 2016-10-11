import * as React from "react";

interface VideoProps {
    source: string;
}

// Check out this stackoverflow thread to understand why this component
// http://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element/28060352#28060352
export default class Video extends React.Component<VideoProps, any> {
  
  private videoElt: HTMLVideoElement;

  constructor(props : VideoProps) {
    super(props)
  }
   
  componentWillUnmount() : void {
    this.videoElt.pause();
    this.videoElt.src = "";
    this.videoElt.load();
  }
  
  render() {
    const { source } = this.props; 
    return (
      <video autoPlay loop style={{maxHeight: "100%", maxWidth: "100%" }} 
        ref={(ref) => this.videoElt = ref}
      >
        <source src={source} />
      </video>
    );
  }
}