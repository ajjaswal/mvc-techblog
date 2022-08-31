import React from 'react';

import { Container } from 'react-bootstrap';

const AppFooter = () => {
    return (
        <>
            <Container fluid className="text-light page-footer d-flex">
                <Container>
                    
                    <div className="d-flex justify-content-between">
                        <p>2022</p>
                        <p><a className="footer-link" href="https://github.com/ajjaswal/movie-library"><i className="fab fa-github pr-3"></i>Visit the GitHub Repo</a></p>
                    </div>
                </Container>
            </Container>
        </>
    )
};
export default AppFooter;