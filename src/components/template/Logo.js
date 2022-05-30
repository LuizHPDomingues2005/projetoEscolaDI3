import './Logo.css';
import React from 'react';
import logo from '../../assets/logo_escola.png';

export default function(props){
    return (
        <aside className="logo">
            <a href='/' className="logo">
                <img src={ logo } alt="Logo" />
            </a>
        </aside>

    )
}