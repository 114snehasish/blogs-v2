---
title: "Unleash Efficiency: Automating Azure Infrastructure with Terraform and GitHub Actions"
date: "2024-04-25"
slug: "gha-with-tf"
description: "“Automate your Azure infrastructure provisioning with Terraform and streamline your workflow with GitHub Actions. Say goodbye to manual setups and hello to efficiency and consistency. Learn how to leverage these powerful tools in our latest blog post! #Azure #Terraform #GitHubActions #InfrastructureAsCode”"
tags: ["Azure", "code", "GitHub Actions", "Infrastrue As Code", "Terraform"]
wordpressId: 463
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/gha-with-tf/AZTFGA.png"
coverImageResolutions:
  thumbnail: "/blog-images/gha-with-tf/AZTFGA-150x150.png"
  medium: "/blog-images/gha-with-tf/AZTFGA-300x169.png"
  mediumLarge: "/blog-images/gha-with-tf/AZTFGA-768x432.png"
  large: "/blog-images/gha-with-tf/AZTFGA-1024x576.png"
  full: "/blog-images/gha-with-tf/AZTFGA.png"
seo:
  ogTitle: "Unleash Efficiency: Automating Azure Infrastructure with Terraform and GitHub Actions Blogs by Snehasish"
  ogDescription: "Automate your Azure infrastructure provisioning with Terraform and streamline your workflow with GitHub Actions. Say goodbye to manual setups and hello to efficiency and consistency. Learn how to leverage these powerful tools in our latest blog post! #Azure #Terraform #GitHubActions #InfrastructureAsCode"
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2024/04/AZTFGA.png"
  twitterCard: "summary_large_image"
  twitterTitle: "Unleash Efficiency: Automating Azure Infrastructure with Terraform and GitHub Actions Blogs by Snehasish"
  twitterDescription: "Automate your Azure infrastructure provisioning with Terraform and streamline your workflow with GitHub Actions. Say goodbye to manual setups and hello to efficiency and consistency. Learn how to leverage these powerful tools in our latest blog post! #Azure #Terraform #GitHubActions #InfrastructureAsCode"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/full-stack-engineering/devops/gha-with-tf/"
---

Table Of Contents

1.  [Introduction](#introduction)
    -   [What is Azure](#what-is-azure)
    
    -   [Why Terraform](#why-terraform)
    
    -   [How GitHub Action is helping the Duo](#how-github-action-is-helping-the-duo)
2.  [Prerequisites](#prerequisites)
3.  [Create a Service Principle](#create-a-service-principle)
4.  [Create a Storage Account](#create-a-storage-account)
5.  [Our First Terraform Script](#our-first-terraform-script)
6.  [Create a GitHub Action Workflow](#create-a-github-action-workflow)

### Introduction

In today’s digital world, getting your infrastructure up and running quickly is crucial. That’s where Azure comes in – it’s Microsoft’s cloud platform packed with tools to help businesses thrive. Pair it with Terraform, a tool for setting up infrastructure, and GitHub Actions, which automates tasks, and you’ve got a powerful trio. Together, they make it easy to build, manage, and deploy your infrastructure on Azure. In this blog, we’ll show you how these tools work together to make your life easier. Before we jump Further lets check these technologies and their roles in this trifecta.

#### What is Azure

[Microsoft Azure](https://azure.microsoft.com/) is a cloud computing platform offering a vast array of services including virtual machines, databases, AI, and more. It provides scalability, reliability, and security for building and deploying applications.

#### Why Terraform

[Terraform](https://www.terraform.io/) is an Infrastructure as Code (IaC) tool by [HashiCorp](https://www.hashicorp.com/). It enables users to define and provision infrastructure resources such as virtual machines, networks, and databases using a declarative configuration language. Terraform ensures consistency and repeatability in infrastructure management across various cloud providers, including Azure.

#### How GitHub Action is helping the Duo

[GitHub Actions](https://github.com/features/actions) is a powerful automation tool integrated into the GitHub platform. It allows developers to automate workflows directly from their repositories, enabling tasks like continuous integration, deployment, and more.

### Prerequisites

1.  **Basic Understanding of Azure**: Familiarity with [Microsoft Azure](https://azure.microsoft.com/) services and concepts will be beneficial for following along with the examples and understanding the integration with Terraform and GitHub Actions.
2.  **GitHub Account**: You’ll need an active GitHub account to utilize GitHub Actions for automating your workflows. If you don’t have one already, you can easily create a free account on [GitHub’s website](https://github.com/).
3.  **Knowledge of Terraform**: While not mandatory, having a basic understanding of Terraform and its syntax will help you grasp the concepts discussed in this blog more effectively. If you’re new to Terraform, consider familiarizing yourself with its documentation or introductory tutorials beforehand. After that its an on-demand learning process.
4.  **Access to an Azure Subscription**: To provision resources on Azure using Terraform and to integrate GitHub Actions with your Azure environment, you’ll need access to an Azure subscription. If you don’t have one, you can sign up for a free Azure account or use an existing subscription if available.
5.  **GitHub Repository**: Ensure you have a GitHub repository set up for your project or infrastructure code. This repository will serve as the central location for managing your code and configuring GitHub Actions workflows. If you haven’t created a repository yet, you can create one directly on GitHub’s website or through the GitHub CLI.
6.  **AZ CLI and Terraform installed on your computer:** We will use AZ CLI to create some prerequisite Azure Resources(But you can use Azure Portal As well if you want) and the Terraform needs to be installed in our system so that we can check the validity of our Terraform scripts before pushing the code to GitHub, for local development purpose. But anyway, at the end, we will be relying on GitHub Actions to run all our Terraform commands.

### Create a Service Principle

Run below command to create a [Service Principle](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser)(Service Principles are like automation users which Terraform and GitHub Actions will use to manage Azure Resources).

```sh
az ad sp create-for-rbac --name <service-principal-name> --role Contributor --scopes /subscriptions/<subscription-id>
```

Replace **service-principal-name** with the name that you want to set, and the **subscription-id** is with the Subscription ID within which you want to manage your infrastructure. This will give you the output in below format, store it somewhere safe as we will be needing the info later on.

```json
{
  "appId": "<some generated value>",
  "displayName": "<service-principal-name>",
  "password": "<some generated value>",
  "tenant": "<default tenant id of your subscription>"
}
```

We will refer the **appId** and **password** as **Client ID** and **Client Secret** going forward. You can also validate the information by navigating the **Portal => Microsoft Entra ID =>App Registration => All Applications**

### Create a Storage Account

We need to have One Storage Account and a Container created within that Storage Account. We need this so that Terraform can maintain the **tfstate** file for its internal use. The tfstate file is used to store the state of the infrastructure managed by Terraform, including resource metadata and dependencies, enabling Terraform to understand and manage changes to the infrastructure.

```sh
# Create Resource Group
az group create -n <resource-group-name> -l <location>

# Create Storage Account
az storage account create -n <storage-account-name> -g <resource-group-name> -l <location> --sku Standard_LRS

# Create Storage Account Container
az storage container create -n <container-name> --account-name <storage-account-name>
```

Creating the Service Principal and the Storage Account should be the one time activity that you need to do before start managing everything through Terraform, so lets start with it.

### Our First Terraform Script

Create a folder that you will push to your GitHub Repository and create a **main.tf** file within it. for Eg. below is a sample code that creates a resource group and a Vnet within it.

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.99.0"
    }
  }
  backend "azurerm" {
    # The resource group and the Storage Account you have created in the last step to store tfstate file will go here.
    # These can be considered as sensitive informations and we will see how to externalize these values through GitHub Actions
    # using -backend-config command line arguments..
    resource_group_name   = "learn-terraform-rg"
    storage_account_name = "tfstatesa"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
  skip_provider_registration = true
  # Below are the information that AZ CLI spited out when you created the Service Principal,
  # you can hard-code this value here, but that is not good practice, we will soon see how this syntax will work with GitHub Actions
  subscription_id = var.azure_subscription_id
  client_id       = var.spn_client_id
  client_secret   = var.spn_client_secret
  tenant_id       = var.azure_tenant_id
}

# Create a resource group
resource "azurerm_resource_group" "terraform-created-this-rg" {
  name     = "terraform-created-this-rg"
  location = "East US"
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "terraform-created-this-vnet" {
  name                = "terraform-created-this-vnet"
  resource_group_name = azurerm_resource_group.terraform-created-this-rg.name
  location            = azurerm_resource_group.terraform-created-this-rg.location
  address_space       = ["10.0.0.0/16"]
}
```

### Create a GitHub Action Workflow

In order to create A GitHub Action Workflow, create a folder named **.github** in your project root, within that create another folder named **workflows** and then within that create a YAML file, below is a sample file:

```yaml
name: "Create Infrastructure"

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Environment to create infrastructure for"
        required: true
        default: dev

jobs:
  terraform:
    name: "${{github.event.inputs.environment}}-terraform"
    runs-on: ubuntu-latest
    environment: ${{github.event.inputs.environment}}
    defaults:
      run:
        shell: bash
    env:
      ARM_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
      ARM_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
      ARM_SUBSCRIPTION_ID: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      ARM_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Login to Azure
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Terraform Init
        run: terraform init -backend-config="resource_group_name=${{ secrets.RESOURCE_GROUP_NAME }}" -backend-config="storage_account_name=${{ secrets.STORAGE_ACCOUNT_NAME }}" -backend-config="container_name=${{ secrets.CONTAINER_NAME }}" -backend-config="key=terraform.tfstate"
      - name: Terraform Validate
        run: terraform validate

      - name: Terraform Plan
        run: terraform plan -input=false -var="spn_client_id=${{ secrets.AZURE_CLIENT_ID }}" -var="spn_client_secret=${{ secrets.AZURE_CLIENT_SECRET }}" -var="azure_tenant_id=${{ secrets.AZURE_TENANT_ID }}" -var="azure_subscription_id=${{ secrets.AZURE_SUBSCRIPTION_ID }}"

      - name: Terraform Apply
        run: terraform apply -input=false -var="spn_client_id=${{ secrets.AZURE_CLIENT_ID }}" -var="spn_client_secret=${{ secrets.AZURE_CLIENT_SECRET }}" -var="azure_tenant_id=${{ secrets.AZURE_TENANT_ID }}" -var="azure_subscription_id=${{ secrets.AZURE_SUBSCRIPTION_ID }}" -input=false -auto-approve
```

In the above workflow file, if you observe the terraform commands(init, plan or apply), then you will see we are passing logs of argument flags named –**backend-config** and **\-var** and the values are actually referred from GitHub Secrets. This way we can avoid putting sensitive information pushed to source control. For a GitHub repository(either public or private) GitHub Secrets are **Write only\[**only authorized GitHub users can Create/Update secrets\] and the existing values can not be read. For more on GitHub Secrets, please refer [this link](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

Below are the descriptions of all the secrets we are using

-   **AZURE\_CREDENTIALS**: Store the entire JSON structure that came when we created the Service Principal through AZ CLI.
-   **STORAGE\_ACCOUNT\_NAME**: The storage account you created to store the tfstate file
-   **CONTAINER\_NAME**: The container that you created within the storage account to store the tfstate file.
-   **AZURE\_CLIENT\_ID**: Client ID of the Service Principal
-   **AZURE\_CLIENT\_SECRET**: Password of the Service Principal
-   **AZURE\_TENANT\_ID**: Default Tenant ID
-   **AZURE\_SUBSCRIPTION\_ID**: The Subscription ID within which resources will be managed.

That’s it, You should now be able to run the GitHub Action from the “Actions” Tab in the GitHub Portal.

Please refer to [this repo](https://github.com/114snehasish/terraform-azure-github-action) if you want to go straight exploring the entire solution. Happy coding.
