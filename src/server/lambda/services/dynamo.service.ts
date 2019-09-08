import { DynamoDB } from 'aws-sdk';

const dynamodb: DynamoDB = new DynamoDB();

const CONNECTOR_TABLE: string = 'connectors';

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
        const queryResponse: DynamoDB.QueryOutput = await queryConnectors(cognitoUserId);
        // Create the put params -- userID to map of connector names to connector ips -- expand item if available
        const connectorMap: DynamoDB.MapAttributeValue = queryResponse.Items && queryResponse.Items[0].connectors.M ? {
            M: {
                ...queryResponse.Items[0].connectors.M,
                [connectorName]: connectorIP
            }
        } : {
            M: {
                [connectorName]: connectorIP
            }
        };

        const putParams: DynamoDB.PutItemInput = {
            TableName: CONNECTOR_TABLE,
            Item: {
                userID: {
                    S: cognitoUserId
                },
                connectors: connectorMap
            }
        };
        await dynamodb.putItem(putParams).promise();
        console.log('New connector added for user ' + cognitoUserId);
    }
    catch (error)
    {
        console.error('Failed to put item in table for the user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}

export const deleteConnector = async (cognitoUserId: string, connectorName: string) =>
{
    try
    {
        // Get the user connector info
        const queryResponse: DynamoDB.QueryOutput = await queryConnectors(cognitoUserId);

        // Delete the connector from the collection and then put the item
        if (queryResponse.Count && queryResponse.Count > 0)
        {
            const updateItemResponse: DynamoDB.UpdateItemOutput = await dynamodb.updateItem(updateItemParams).promise();
        }
    }
    catch (error)
    {
        console.error('Failed to delete the connector for the user ' + cognitoUserId);
        console.error(error);
        throw error;
    }
}

export const getConnector = async (cognitoUserId: string, connectorName: string) =>
{

}

export const updateConnector = async (cognitoUserId: string, connectorName: string, connectorIP: string) =>
{

}