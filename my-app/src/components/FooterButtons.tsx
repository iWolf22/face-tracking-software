import React from 'react';
import IconButton from '@mui/material/IconButton';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';


export default function FooterButtons() {

    var buttonIconStyle = {
        color: '#a6b5c5',
        height: '40px',
        width: '40px',
        '&:hover': {
            backgroundColor: '#32404e'
        }
    }

    return (
        <div>
            <IconButton
                href='https://www.instagram.com/joshua.dierickse/'
                target='__blank'
                sx={buttonIconStyle}
            >
                <InstagramIcon />
            </IconButton>
            <IconButton
                href='https://github.com/iWolf22'
                target='__blank'
                sx={buttonIconStyle}
            >
                <GitHubIcon />
            </IconButton>
            <IconButton
                href='https://www.linkedin.com/in/joshua-dierickse-360741207/'
                target='__blank'
                sx={buttonIconStyle}
            >
                <LinkedInIcon />
            </IconButton>
            <IconButton
                href='https://iwolf22.github.io/Personal-Website/'
                target='__blank'
                sx={buttonIconStyle}
            >
                <LanguageIcon />
            </IconButton>
        </div>
        );
};