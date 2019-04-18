import { Handler, APIGatewayProxyEvent, Context } from 'aws-lambda';

export const createConnector: Handler = (event: APIGatewayProxyEvent, context: Context) =>
{
    console.log(event);
    console.log(context);

    return
}

export const getConnector: Handler = (event: APIGatewayProxyEvent, context: Context) =>
{
    console.log(event);
    console.log(context);
}

export const deleteConnector: Handler = (event: APIGatewayProxyEvent, context: Context) =>
{
    console.log(event);
    console.log(context);
}

export const closeChannel: Handler = (event: APIGatewayProxyEvent, context: Context) =>
{
    console.log(event);
    console.log(context);
}

export const getConnectorInfo: Handler = (event: APIGatewayProxyEvent, context: Context) =>
{
    console.log(event);
    console.log(context);
}

export const stopConnector: Handler = (event: APIGatewayProxyEvent, context: Context) =>
{
    console.log(event);
    console.log(context);
}