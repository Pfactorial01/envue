import {Client, Account, Teams } from 'appwrite';

export const envs = {
    endpoint : process.env.NEXT_PUBLIC_ENDPOINT as string,
    project : process.env.NEXT_PUBLIC_PROJECT as string
}

export const client = new Client()
    .setEndpoint(envs.endpoint)
    .setProject(envs.project);

export const account = new Account(client);
export const teams = new Teams(client);

