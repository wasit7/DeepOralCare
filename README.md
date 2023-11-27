
# OralCancerAI: Deep Learning and Knowledge Graph-Based Application

![OralCancerAI Logo](DeepOralCareLogo.png)

## About

OralCancerAI is an innovative application designed to enhance oral cancer diagnosis and medical training by leveraging cutting-edge deep learning models and the knowledge graph PrimeKG. This README provides an overview of the project, how to set it up, and a basic demo to get you started.

## Table of Contents
- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Docker](https://www.docker.com/products/docker-desktop/)
- Docker compose

### Installation

To set up OralCancerAI, follow these steps:

1. Clone the repository:
    ```bash
   git clone https://github.com/wasit7/DeepOralCare.git
    ```
  
2. Run project using docker:
    ``` bash
    cd web
    docker compose up --build
    ```
  
3. Configure your Django settings, including database and PrimeKG integration. following [Import data](/docs/README.md)
  
Now, OralCancerAI should be up and running locally.

## Usage

### Demo

To see the application in action, follow these steps:

1. Access the web interface by opening a web browser and navigating to http://localhost:8000.

2. Sign in with your credentials or create a new account.

3. Explore the application's features, including image-based oral cancer detection and knowledge graph-driven insights into risk factors.

4. Upload sample oral cancer images to test the deep learning model's accuracy.

## Contributing

We welcome contributions from the community. If you'd like to contribute to OralCancerAI, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- The [Health Systems Research Institute (HSRI)](https://www.hsri.or.th/) for providing research grant HSRI-65-025.
- The PrimeKG development team for their invaluable knowledge graph resource.
- Our research participants who provided valuable feedback during the evaluation.
You can use this corrected Markdown content as your project's README.md file on GitHub, with all code sections formatted using triple backticks ().