import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Divider, Paper } from "@mui/material";
import { MapContainer, TileLayer, Polyline, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon1 from '../assets/images/car-icon-map.png';
import icon2 from '../assets/images/res-icon-map.png';
import icon3 from '../assets/images/user-icon-map.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useParams } from "react-router-dom";

// Custom icons
const carIcon = L.icon({
    iconUrl: icon1,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const customerIcon = L.icon({
    iconUrl: icon3,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const restaurantIcon = L.icon({
    iconUrl: icon2,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const Track = () => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [routeData, setRouteData] = useState<any>(null);
    const { orderId } = useParams();
    console.log(orderId);

    useEffect(() => {
        //const orderID = localStorage.getItem("orderID");

        if (orderId) {
            fetch(`http://localhost:8000/orders?date_id=${orderId}`)
                .then((response) => response.json())
                .then((data) => {
                    setOrder(data[0]);
                    setLoading(false);

                    const requestData = {
                        customer_address: data[0].customerAddress,
                        restaurant_address: data[0].restaurantAddress,
                        driver_address: data[0].driverLocation,
                        order_picked_up: false
                    };

                    fetch("http://127.0.0.1:5000/predict-eta", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestData),
                    })
                        .then((response) => response.json())
                        .then((routeData) => {
                            console.log("Route data:", routeData);
                            setRouteData(routeData);
                        })
                        .catch((error) => {
                            console.error("Error fetching route data:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error fetching order:", error);
                    setLoading(false);
                });
        }
    }, [orderId]);

    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box p={4}>
                <Typography variant="h6">Order not found</Typography>
            </Box>
        );
    }

    // Format the polyline coordinates correctly
    const polylinePath = routeData?.route?.polyline
        ? routeData.route.polyline.map((point: { latitude: number; longitude: number }) => [
            point.latitude,
            point.longitude
        ])
        : [];

        const formatETA = () => {
            const eta = routeData?.route?.eta_seconds;
            if (!eta || eta === "Unknown") return "ETA not available";
            const etaMinutes = Math.round(eta / 60);
            return etaMinutes <= 1 ? "1 minute" : `${etaMinutes} minutes`;
        };
        

    // Calculate center point for the map
    const mapCenter = polylinePath.length > 0
        ? polylinePath[Math.floor(polylinePath.length / 2)]
        : routeData?.driver_coords ?? [31.8782, -77.6398]


    console.log("coords:", routeData?.driver_coords)
    // Map component to fit bounds to the polyline
    const MapFitter = () => {
        const map = useMap();

        useEffect(() => {
            if (polylinePath.length > 0) {
                try {
                    const bounds = L.latLngBounds(polylinePath);
                    map.fitBounds(bounds, { padding: [50, 50] });
                } catch (error) {
                    console.error("Error setting map bounds:", error);
                }
            }
        }, [polylinePath]);

        return null;
    };

        const parseETAString = (etaString: string) => {
            const lines = etaString?.split('\n');
            const result: any = {};
        
            lines?.forEach(line => {
            if (line.includes('Driver -> Restaurant')) {
                const match = line.match(/Distance: ([\d.]+) km, ORS ETA: ([\d.]+) min/);
                if (match) {
                result.driverToRestaurant = {
                    distanceKm: parseFloat(match[1]),
                    etaMin: parseFloat(match[2])
                };
                }
            } else if (line.includes('Restaurant -> Customer')) {
                const match = line.match(/Distance: ([\d.]+) km, ORS ETA: ([\d.]+) min/);
                if (match) {
                result.restaurantToCustomer = {
                    distanceKm: parseFloat(match[1]),
                    etaMin: parseFloat(match[2])
                };
                }
            } else if (line.includes('Total Hybrid ETA')) {
                const match = line.match(/Total Hybrid ETA: ([\d.]+) min/);
                if (match) {
                result.totalETA = parseFloat(match[1]);
                }
            }
            });
        
            return result;
        };

        const parsedETA = parseETAString(routeData?.route?.eta_seconds);

        console.log(parsedETA);

    // Function to check if coordinates are valid
    const isValidCoordinates = (coords: any) => {
        return coords && coords[0] && coords[1] && !isNaN(coords[0]) && !isNaN(coords[1]);
    };

    return (
        <Box display="flex" height="100vh">
            {/* Sidebar */}
            <Box
                sx={{
                    width: "300px",
                    bgcolor: "background.paper",
                    p: 2,
                    borderRight: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Order Tracking
                </Typography>
                <Box mt={3}>
                    <Typography variant="h6">Order Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">
                        <strong>Order ID:</strong> {order.date_id}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Restaurant:</strong> {order.restaurantName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Delivery Address:</strong> {order.customerAddress}
                    </Typography>
                    {/* <Typography variant="body1">
                        <strong>Delivery Status:</strong> {order.deliveryStatus}
                    </Typography> */}

                    {routeData && (
                        <>
                            <Typography variant="body1" sx={{ mt: 1, color: 'green' }}>
                                <strong>Estimated Arrival:</strong> {Math.ceil(parsedETA.totalETA)} minutes
                            </Typography>
                            {routeData.route?.distance_meters && (
                                <Typography variant="body1">
                                    <strong>Distance:</strong> {(routeData.route.distance_meters / 1000).toFixed(1)} km
                                </Typography>
                            )}
                        </>
                    )}

                    <Box mt={2}>
                        <Typography variant="body1">
                            <strong>Items:</strong>
                        </Typography>
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item: any) => (
                                <Typography key={item.id} variant="body2">
                                    {item.title} - {item.quantity} x ${item.price}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2">No items in this order.</Typography>
                        )}
                    </Box>
                    <Typography variant="body2" sx={{mb: 0.5}}>
                        <strong>Delivery Fee:</strong> ${order.deliveryFee}
                    </Typography>
                    <Typography variant="body2" sx={{mb: 0.5}}>
                        <strong>Tax:</strong> ${order.tax}
                    </Typography>
                    <Typography variant="body2" sx={{mb: 0.5}}>
                        <strong>Total:</strong> ${order.total}
                    </Typography>
                </Box>
            </Box>

            {/* Map Area */}
            <Box sx={{ flexGrow: 1, bgcolor: "background.default" }}>
                <Paper elevation={3} sx={{ height: "100%" }}>
                    <MapContainer
                        style={{ height: "100%" }}
                        center={mapCenter as [number, number]}
                        zoom={20}
                        scrollWheelZoom={true}
                    >
                        <MapFitter />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {polylinePath.length > 0 && (
                            <Polyline
                                positions={polylinePath}
                                color="blue"
                                weight={5}
                                opacity={0.7}
                            />
                        )}
{/* 
                        {routeData?.restaurant_coords && routeData?.customer_coords && (
                            <Polyline
                                positions={[
                                    [routeData.restaurant_coords[0], routeData.restaurant_coords[1]],
                                    [routeData.customer_coords[0], routeData.customer_coords[1]]
                                ]}
                                color="blue"
                                weight={5}
                                opacity={0.7}
                            />
                        )} */}

                        {/* Add markers for restaurant, customer, and driver */}
                        {isValidCoordinates(routeData?.restaurant_coords) && (
                            <Marker
                                position={routeData.restaurant_coords}
                                icon={restaurantIcon}
                            />
                        )}

                        {isValidCoordinates(routeData?.customer_coords) && (
                            <Marker
                                position={routeData.customer_coords}
                                icon={customerIcon}
                            />
                        )}

                        {isValidCoordinates(routeData?.driver_coords) && (
                            <Marker
                                position={routeData.driver_coords}
                                icon={carIcon}
                            />
                        )}
                    </MapContainer>
                </Paper>
            </Box>
        </Box>
    );
};

export default Track;
