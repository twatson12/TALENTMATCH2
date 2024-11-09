// src/components/DashboardContent.js
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Card, Row, Col } from 'react-bootstrap';

function DashboardContent() {
    return (
        <div className="dashboard-content">
            <Row>
                <Col md={6}>
                    <Card className="mb-4" style={{ background: 'rgba(255, 215, 0, 0.8)' }}>
                        <Card.Body>
                            <Card.Title>
                                <FaStar className="me-2 text-dark" /> Upcoming Opportunities
                            </Card.Title>
                            <Card.Text>
                                Find your next star-studded event and role opportunities here.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4" style={{ background: 'rgba(255, 215, 0, 0.8)' }}>
                        <Card.Body>
                            <Card.Title>
                                <FaStar className="me-2 text-dark" /> Notifications
                            </Card.Title>
                            <Card.Text>
                                Stay updated with the latest notifications about your applications.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card className="mb-4" style={{ background: 'rgba(255, 215, 0, 0.8)' }}>
                        <Card.Body>
                            <Card.Title>
                                <FaStar className="me-2 text-dark" /> Your Profile
                            </Card.Title>
                            <Card.Text>
                                View and edit your profile details to make the best impression.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardContent;

