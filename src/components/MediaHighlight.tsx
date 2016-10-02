import * as React from "react";

interface MediaProps {
    picture: string;
}

export default ({ picture }: MediaProps) => {
    if (picture.endsWith("mp4")) {
        return (
            <video autoPlay loop style={{maxHeight: "100%", maxWidth: "100%" }} >
              <source src={picture} />
            </video>
        )
    }

    return (
        <img 
            src={picture} 
            style={{maxHeight: "100%", maxWidth: "100%" }} 
        />
    )
}