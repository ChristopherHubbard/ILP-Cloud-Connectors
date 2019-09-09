import { ECS, AWSError } from 'aws-sdk';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const { connectorRegion, connectorPort, connectorClusterName, connectorTaskDefinition, connectorVPCSubnets, connectorSecurityGroups } = require('../config/fargate.config.json');

// Create an ECS context to create tasks
const ecs: ECS = new ECS({
    region: connectorRegion
});

export const createConnectorTask = async (uplinkName: string, testnet: string, secret: string): Promise<ECS.RunTaskResponse> =>
{
    // Create the task request with the parameters for the run -- hopefully doesn't override image start command and
    // simply extends it
    const runTaskParams: ECS.RunTaskRequest =
    {
        taskDefinition: connectorTaskDefinition,
        launchType: 'FARGATE',
        cluster: connectorClusterName,
        overrides: {
            containerOverrides: [
                {
                    name: 'ilp-cloud-connector',
                    command: [
                        'node',
                        '/distlib/src/server/docker.index.js',
                        '--uplinkName',
                        uplinkName,
                        '--testnet',
                        testnet,
                        '--secret',
                        secret
                    ]
                }
            ]
        },
        networkConfiguration: {
            awsvpcConfiguration: {
                subnets: connectorVPCSubnets,
                securityGroups: connectorSecurityGroups,
                assignPublicIp: 'ENABLED'
            }
        }
    };

    try
    {
        // Lambda needs to have ECS IAM policies -- make sure the task definition with this tag exists before trying to create
        const task = await ecs.runTask(runTaskParams).promise();
        console.log('Task created for user');

        // Return the reference information to interact with this connector
        return task;
    }
    catch (error)
    {
        console.error('Failed to create task for user');
        console.error(error);
        throw error;
    }
}

export const startConnectorTask = async (connectorIP: string): Promise<void> =>
{
    // Create the options for the request -- type?
    const requestOptions: AxiosRequestConfig =
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try
    {
        // Send the start request to this IP
        await axios.post(`https://${connectorIP}:${connectorPort}/connector/start`, requestOptions);
    }
    catch (error)
    {
        console.error('Failed to start connector ' + connectorIP);
        console.error(error);
        throw error;
    }
}

export const getConnectorTaskInfo = async (connectorIP: string): Promise<any> =>
{
    // Create the options for the request -- type?
    const requestOptions: AxiosRequestConfig =
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try
    {
        const response: AxiosResponse = await axios.get(`https://${connectorIP}:${connectorPort}/connector/info`, requestOptions);
        return response.data;
    }
    catch (error)
    {
        console.error('Failed to get connector information for ' + connectorIP);
        console.error(error);
        throw error;
    }
}

// Service to stop the running connector channels
export const stopConnectorTask = async (connectorIP: string): Promise<void> =>
{
    // Create the options for the request -- type?
    const requestOptions: AxiosRequestConfig =
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try
    {
        await axios.post(`https://${connectorIP}:${connectorPort}/stop`, requestOptions);
    }
    catch (error)
    {
        console.error('Failed to stop connector ' + connectorIP);
        console.error(error);
        throw error;
    }
}

export const deleteConnectorTask = async (connectorARN: string): Promise<void> =>
{
    const deleteTaskParams: ECS.StopTaskRequest =
    {
        cluster: 'ILP-Cloud-Connectors',
        task: connectorARN
    };

    try
    {
        await ecs.stopTask(deleteTaskParams).promise();
    }
    catch (error)
    {
        console.error('Failed to delete connector task ' + connectorARN);
        console.error(error);
        throw error;
    }
}