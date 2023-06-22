
# Healthcare Records on Hyperledger Fabric

## Introduction

This project is a healthcare records management system built on the Hyperledger Fabric blockchain. It allows patients to securely store and share his records with different healthcare providers, like doctor, pharmacy, lab. Patient can even claim for insurance for a record using the same system. This ensures patient privacy and data security.

## Technologies Used

- Hyperledger Fabric
- Hyperledger Explorer
- CouchDB
- Docker
- NodeJS
- ExpressJS
- MongoDB
- ReactJS
- TailwindCSS

## Features

### Patient
- Registration by anyone
- Login
- Allow access to particular healthcare provider(doctor, pharmacy, lab, insurance)
- See all records
- Claim for Insurance
  
### Doctor
- Registration by Admin
- Login
- See record history of patient
- Write Prescription

### Pharmacy
- Registration by Admin
- Login
- See Medicines Written in prescription by doctor
- Update Dispensed medicine record with bill Amount
- Write comment on unavailable medicine

### Lab
- Registration by Admin
- Login
- See Lab Tests Written in prescription by doctor
- Update Lab Test record with bill Amount

### Insurance
- Registration by Admin
- Login
- See all claim requests
- Approve/Decline Claim Request

## Installation and Usage

### Prerequisites

Verify that you have the following installed:

```bash
$ node -v
v16.20.0
```

```bash
$ npm -v
8.19.4
```

```bash
$ docker -v
Docker version 23.0.1, build a5ee5b1
```

```bash
$ docker-compose -v
Docker Compose version v2.15.1
```

```bash
$ git --version
git version 2.39.2
```

#### Installation

- Clone the repository
    
    ```bash
    $ git clone https://github.com/raj-71/heathcare-hyperledger.git
    $ cd heathcare-hyperledger
    ```
- Add .env file as specified in the backend folder
- Start the hyperledger fabric network

    ```bash
    $ ./fablo up fablo-config.json
    $ cd backend/config
    $ ./generate-ccp
    ```

- Start the backend server
  
    ```bash
    $ cd backend
    $ npm install
    $ node app.js
    ```

- Start the frontend server

    ```bash
    $ cd client
    $ npm install
    $ npm start
    ```

POSTMAN API: https://api.postman.com/collections/25063944-f42cbb68-f9f8-4911-afd4-671d502b89ba?access_key=PMAT-01GY310EJ295VY22436MYX0SBQ

#### Usage

- Open the frontend server in browser

    ```bash
    http://localhost:3000
    ```
- You have to add admin credentials in mongodb manually with the format given below in users file to create Doctor, Pharmacy, Lab, Insurance users

    ```bash
    { userName:"your_user_name" orgName: "Admin" userId:"your_user_id" password:"password" }
    ```
- Now you can register as a patient and other users with admin credentials and login to the system

## Architecture

### Hyperledger Fabric Network

- 5 Organizations
    - Patient
    - Doctor
    - Pharmacy
    - Lab
    - Insurance
- Peers
    - 1 Peer for each organization
- Ledger
    - 1 CouchDB ledger for each peer
- Channel
    - main-channel1
- Chaincode
    - chaincode1

## Troubleshooting

Incase if any of the commands fail due to configurations or the network was not brought down properly use the following commands to clear the corrupted docker images and fix the issue.

1. Stop the network

    ```bash
    $ ./fablo down
    ```

2. Again Up the network

    ```bash
    $ ./fablo up fablo-config.json
    ```

3. Stop the containers

    ```bash
    $ docker stop $(docker ps -a -q)
    ```

4. Remove the containers

    ```bash
    $ docker rm $(docker ps -a -q)
    ```

5. Remove all local volumns

    ```bash
    $ docker volume prune
    ```

6. Remove all wallets

    ```bash
    $ rm -rf /backend/*-wallet
    ```

7. Authorization error code 71 -> Regenerate all connection profies in backend

    ```bash
    $ cd backend/config
    $ ./generate-ccp
    ```

8. Incase of affiliation error -> authorization error code 20
    
    
    Copy paste these lines in all the fabric-ca-server-config.yaml (total 6 such files)
    files in the network. File locations: 

    /fablo-target/fablo-config/fabric-ca-server-config/*.healthcare.com/fabric-ca-server-config.yaml
    ```
    affiliations:
        patient:
            - department1
        doctor:
            - department1
        pharmacy:
            - department1
        lab:
            - department1
        insurance:
            - department1
    ```


## Contributions

Project Work: CS731 - Blockchain Technology and Application
Professor: Angshuman Karmakar

#### Team Members:
1. Raj Kumar - 22111050
2. Madhav Maheswari - 22111037
3. Sarthak Neema - 22111079
4. Sumit Chaudhary - 22111060

