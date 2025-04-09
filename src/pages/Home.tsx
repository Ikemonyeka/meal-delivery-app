import React from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";

import { Link } from "react-router-dom";

import guyImg from "../assets/images/delivery-img.png";
import fastDeliveryIcon from "../assets/images/fast-delivery-guy.png"; // Add your icon image path
import satisfactionIcon from "../assets/images/satisfaction-img.png"; // Add your icon image path
import easyProcessIcon from "../assets/images/transaction-img.png"; // Add your icon image path
import "../styles/hero-section.css";

const Home = () => {
    return (
        <div title="Home">
        <section>
            <Container>
            <Row>
                <Col lg="6" md="6">
                <div className="hero__content">
                    <h5 className="mb-3">Easy order & fast delivery</h5>
                    <h1 className="mb-4 hero__title">
                    <span>Enjoy</span> Your Favorite Meal
                    </h1>
                    <Link to="/restuarant" className="order__btn d-flex align-items-center justify-content-between">
                            Browse Restaurants <i className="ri-arrow-right-s-line"></i>
                    </Link>
                </div>
                </Col>

                <Col lg="6" md="6">
                <div className="hero__img">
                    <img src={guyImg} alt="delivery-img" className="w-100" />
                </div>
                </Col>
            </Row>

            {/* New Section: Features with Cards */}
            <Row className="mt-1">
                {/* Quick Delivery Card */}
                <Col lg="4" md="6" sm="12">
                <Card className="feature-card">
                    <img src={fastDeliveryIcon} alt="quick delivery" className="feature-icon" />
                    <CardBody>
                    <CardTitle tag="h5">Quick Delivery</CardTitle>
                    <CardText>
                        We ensure fast delivery to your doorstep so you can enjoy your meal asap!
                    </CardText>
                    </CardBody>
                </Card>
                </Col>

                {/* Customer Satisfaction Card */}
                <Col lg="4" md="6" sm="12">
                <Card className="feature-card">
                    <img src={satisfactionIcon} alt="customer satisfaction" className="feature-icon" />
                    <CardBody>
                    <CardTitle tag="h5">Customer Satisfaction</CardTitle>
                    <CardText>
                        Our priority is making sure you are satisfied with every order, every time.
                    </CardText>
                    </CardBody>
                </Card>
                </Col>

                {/* Easy Process Card */}
                <Col lg="4" md="6" sm="12">
                <Card className="feature-card">
                    <img src={easyProcessIcon} alt="easy process" className="feature-icon" />
                    <CardBody>
                    <CardTitle tag="h5">Easy Process</CardTitle>
                    <CardText>
                        Ordering your favorite meal is easy and simple with our user-friendly platform.
                    </CardText>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </Container>
        </section>
        </div>
    );
};

export default Home;
