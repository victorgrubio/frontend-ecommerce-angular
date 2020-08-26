#!/bin/bash
cd ..
docker build -t victorgrubio/ecommerce-frontend-angular:1.0.0 .
docker push victorgrubio/ecommerce-frontend-angular:1.0.0
