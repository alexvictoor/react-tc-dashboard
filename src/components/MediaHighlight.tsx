import * as React from "react";
import Video from "./Video"

interface MediaProps {
    picture: string;
}

export default ({ picture }: MediaProps) => {
    if (picture.endsWith("mp4")) {
        return (
            <Video source={picture} />
        )
    }

    return (
        <img
            src={picture} 
            style={{maxHeight: "100%", maxWidth: "100%" }} 
        />
    )
}