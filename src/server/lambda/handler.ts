import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { ECS, EC2 } from 'aws-sdk';

import { createConnectorTask, addConnector } from './services';

export const createConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
{
    console.log(event);
    console.log(context);

    const { uplinkName, testnet, secret, cognitoUserId, connectorName } = JSON.parse(event.body as string);
    
    try
    {
        // Create the connector task
        const task = await createConnectorTask(uplinkName, testnet, secret);

        // Save the connector task information
        const taskARN: string = (task.tasks as Array<ECS.Task>)[0].taskArn as string;
        setTimeout(async () => {
            const d = await (new ECS()).describeTasks({
                cluster: 'ILP-Cloud-Connectors',
                tasks: [
                    taskARN
                ]
            }).promise();
            const r = await (new EC2()).describeNetworkInterfaces({
                NetworkInterfaceIds: [
                    ((d.tasks as any)[0].attachments[0] as any).details[1].value as string
                ]
            }).promise();
            console.log(r);
        }, 15000);
        // const c = await addConnector(cognitoUserId, connectorName, (task.tasks as Array<ECS.Task>)[0].t)
        return {
            statusCode: 200,
            body: JSON.stringify({
                task: task
            })
        };
    }
    catch (error)
    {
        console.error(error.toString());

        return {
            statusCode: 500,
            body: JSON.stringify({})
        }
    }
}

export const startConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
{
    console.log(event);
    console.log(context);

    // The connector can only be started if the state is RUNNING so the IP can be retrieved
    const { cognitoUserId, connectorName } = JSON.parse(event.body as string);

    const taskDescription = 
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

export const getConnectorInfo: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  =>
{
    console.log(event);
    console.log(context);

    return {
        statusCode: 200,
        body: JSON.stringify({
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