import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <Fragment>
            <div className="leftBox">
                <Link className="btn-welcome" to="/signup">Inscription</Link>
            </div>
            <div className="rightBox">
                <Link className="btn-welcome" to="/login">Connexion</Link>
            </div>
        </Fragment>
    )
}

export default Landing
