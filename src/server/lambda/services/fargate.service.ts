import { ECS, AWSError } from 'aws-sdk';

// Create an ECS context to create tasks
const ecs: ECS = new ECS();

export const runConnectorTask = async (uplinkName: string, testnet: string, secret: string) =>
{
    // Create the task request with the parameters for the run -- hopefully doesn't override image start command and
    // simply extends it
    const runTaskParams: ECS.RunTaskRequest = {
        taskDefinition: 'ilp-cloud-connector-task',
        launchType: 'FARGATE',
        cluster: 'ILP-Cloud-Connectors',
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
                subnets: [
                    'subnet-74069d0e',
                    'subnet-d4d5f8bc',
                    'subnet-50e82a1c'
                ],
                securityGroups: [
                    'sg-035cb457f0aa894e3'
                ],
                assignPublicIp: 'ENABLED'
            }
          }
    };

    // Lambda needs to have ECS IAM policies -- make sure the task definition with this tag exists before trying to create
    const task = await ecs.runTask(runTaskParams).promise();
    console.log('Task created for user');

    // Return the reference information to interact with this connector
    return task;
}

export const getTaskInfoByARN = async (taskARN: string): Promise<any> =>
{
    const describeTaskParams: ECS.DescribeTasksRequest = {
        tasks: [
            taskARN
        ],
        cluster: 'ILP-Cloud-Connectors'
    };

    const taskInfo = await ecs.describeTasks(describeTaskParams).promise();
    console.log(taskInfo);
}

// Service to stop the running connector channels
export const stopConnectorTask = async () =>
{

}