import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

import { runConnectorTask, getTaskInfoByARN } from './services';

export const createConnector: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
{
    console.log(event);
    console.log(context);

    const { uplinkName, testnet, secret } = JSON.parse(event.body as string);
    
    try
    {
        const task = await runConnectorTask(uplinkName, testnet, secret);

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

    const { IPAddress } = await getTaskInfoByARN('b0f148f1-0b75-4762-9975-78c049460dfd');

    return {
        statusCode: 200,
        body: JSON.stringify({
            IPAddress
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