package com.disaster.management.service;

import org.springframework.stereotype.Service;

@Service
public class GeoCodingService {

    public double[] getCoordinates(
            String location
    ) {

        switch (
                location.toLowerCase()
        ) {

            case "chennai":
                return new double[]{
                        13.0827,
                        80.2707
                };

            case "bangalore":
                return new double[]{
                        12.9716,
                        77.5946
                };

            case "hyderabad":
                return new double[]{
                        17.3850,
                        78.4867
                };

            case "mumbai":
                return new double[]{
                        19.0760,
                        72.8777
                };

            default:
                return new double[]{
                        20.5937,
                        78.9629
                };
        }

    }

}