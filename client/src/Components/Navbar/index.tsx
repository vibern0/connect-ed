import React, { Component } from 'react';
import logo from '../../Assets/logo.webp';
import './index.css';


interface INavbarState {
    //
}
class Navbar extends Component<{}, INavbarState> {

    public render() {
        return (
            <nav className="navbar" role="navigation" aria-label="main navigation" style={{height: '160px', padding: '30px 50px 0px 50px'}}>
                <div className="navbar-brand">
                    <img src={logo} height="130px" width="130px"/>

                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-end">
                        <a className="navbar-item" style={{ fontVariantCaps: 'all-petite-caps', fontWeight: 600, fontSize: 'larger'}}>
                            Documentation
                        </a>
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-primary">
                                <strong>Sign up</strong>
                            </a>
                            <a className="button is-light">
                                Log in
                                </a>
                        </div>
                    </div>
                </div>
                </div>
            </nav >
        );
    }
}

export default Navbar;
