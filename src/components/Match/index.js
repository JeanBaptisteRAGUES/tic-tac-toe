import React from 'react'
import { useParams } from 'react-router'

const Match = () => {

    const {matchid} = useParams();

    return (
        <div>
            <h1>ID match : {matchid}</h1>
        </div>
    )
}

export default Match
