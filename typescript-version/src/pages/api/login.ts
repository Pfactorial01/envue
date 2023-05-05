import { NextApiRequest, NextApiResponse } from "next/types";
import { Account, Client } from 'appwrite';
import { object, string, TypeOf } from "zod";

const client = new Client();
const endpoint: string = process.env.NEXT_PUBLIC_ENDPOINT as string;
const project: string = process.env.NEXT_PUBLIC_PROJECT as string;
client
    .setEndpoint(endpoint)
    .setProject(project);

const loginSchema = object({
    email: string(),
    password: string(),
});

const account = new Account(client);

export interface LoginApiRequest extends NextApiRequest {
    body: TypeOf<typeof loginSchema>;
}

export default async function login(req: LoginApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    if (req.method !== "POST") {
        res.status(405).send("Method not allowed.");
    }
    const data = loginSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).send({
            message: data.error.message,
        })
    }
    try {
        const result = await account.createEmailSession(email, password);
        res.status(201).send({result})
        console.log(result)
    } catch (err) {
        res.status(500).json({err})
    }
}