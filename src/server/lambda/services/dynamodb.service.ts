import { DynamoDB } from 'aws-sdk';

const dynamodb: DynamoDB = new DynamoDB({
    region: 'us-east-2'
});

const CONNECTOR_TABLE: string = 'ilp-connectors';

export const queryConnectors = async (cognitoUserId: string): Promise<DynamoDB.QueryOutput> =>
{
    try
    {
        // Query for the user in the table
        console.log('Querying for cognito user in connector table');
        const queryParams: DynamoDB.QueryInput = {
            TableName: CONNECTOR_TABLE,
            KeyConditionExpression: 'userID = :userid',
            ExpressionAttributeValues: {
                ':userid': {
                    S: cognitoUserId
                }
            }
        };

        const queryResponse: DynamoDB.QueryOutput = await dynamodb.query(queryParams).promise();
        console.log('Response from query for user ' + queryResponse);
        return queryResponse;
    }
    catch (error)
    {
        console.error('Error querying connectors for user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}

export const addConnector = async (cognitoUserId: string, connectorName: string, connectorIP: string): Promise<void> => 
{
    try
    {
        // Create the update params for this item -- shouldn't need to query because this will add item if it doesn't exist
        const updateParams: DynamoDB.UpdateItemInput = {
            TableName: CONNECTOR_TABLE,
            Key: {
                userID: {
                    S: cognitoUserId
                }
            },
            UpdateExpression: 'SET connectors.#connectorName = :connectorIP',
            ExpressionAttributeNames: {
                '#connectorName': connectorName
            },
            ExpressionAttributeValues: {
                ':connectorIP': {
                    S: connectorIP
                }
            }
        };
        await dynamodb.updateItem(updateParams).promise();
        console.log('New connector added for user ' + cognitoUserId);
    }
    catch (error)
    {
        console.error('Failed to put item in table for the user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}

export const deleteConnector = async (cognitoUserId: string, connectorName: string): Promise<void> =>
{
    try
    {
        // Delete the connector from the collection if it exists
        const updateItemParams: DynamoDB.UpdateItemInput = {
            TableName: CONNECTOR_TABLE,
            Key: {
                userID: {
                    S: cognitoUserId
                }
            },
            UpdateExpression: 'REMOVE connectors.#connectorName',
            ExpressionAttributeNames: {
                '#connectorName': connectorName
            },
            ConditionExpression: 'attribute_exists(userID)'
        };
        await dynamodb.updateItem(updateItemParams).promise();
        console.log('Connector successfully deleted from the collection for user ' + cognitoUserId);
    }
    catch (error)
    {
        console.error('Failed to delete the connector for the user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}

export const getConnector = async (cognitoUserId: string, connectorName: string): Promise<string> =>
{
    try
    {
        const queryResponse: DynamoDB.QueryOutput = await queryConnectors(cognitoUserId);

        // Extract the IP for this connector from the map -- this might throw which means there is no item found or no connector wiht this name
        return ((queryResponse.Items as Array<DynamoDB.AttributeMap>)[0].connectors.M as DynamoDB.MapAttributeValue)[connectorName].S as string;
    }
    catch (error)
    {
        console.error('Failed to get connector' + connectorName + ' for user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}

export const updateConnector = async (cognitoUserId: string, connectorName: string, connectorIP: string): Promise<void> =>
{
    try
    {
        await addConnector(cognitoUserId, connectorName, connectorIP);
        console.log('Connector ' + connectorName + ' updated for user ' + cognitoUserId);
    }
    catch (error)
    {
        console.error('Failed to update the connector ' + connectorName + ' for user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}