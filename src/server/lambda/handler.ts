import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { ECS, AWSError } from 'aws-sdk';

// Use an environment variable for the current docker container tag for the task definition
const CURRENT_DOCKER_TAG: string = '1';

// Create an ECS context to create tasks
const ecs: ECS = new ECS();

export const createConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
{
    console.log(event);
    console.log(context);

    // Create a ECS Fargate task -- the configuration here will likely need to be changed
    const runTaskParams: ECS.RunTaskRequest = {
        taskDefinition: `ilp-cloud-connector:${CURRENT_DOCKER_TAG}`,
        launchType: 'FARGATE',
        cluster: 'ILP-Cloud-Connectors',
    };

    // Lambda needs to have ECS IAM policies
    const task = ecs.runTask(runTaskParams, (error: AWSError, data: ECS.RunTaskResponse) =>
    {
        // Check for errors during the creation of this ECS Fargate task
        if (error)
        {
            console.error(error, error.stack);
        }
        else
        {
            // Place the information on this connector's task into the Table
            console.log('Data from ECS task creation...');
            console.log(data);
        }
    });

    console.log(task);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World'
        })
    };
}

export const getConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
{
    console.log(event);
    console.log(context);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World'
        })
    };
}

export const deleteConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  =>
{
    console.log(event);
    console.log(context);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World'
        })
    };
}

export const closeChannel: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  =>
{
    console.log(event);
    console.log(context);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World'
        })
    };
}

export const getConnectorInfo: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  =>
{
    console.log(event);
    console.log(context);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World'
        })
    };
}

export const stopConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  =>
{
    console.log(event);
    console.log(context);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World'
        })
    };
}