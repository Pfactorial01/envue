import { NextApiRequest, NextApiResponse } from "next/types";
import { Account, Client } from 'appwrite';
import { object, string, TypeOf } from "zod";
import crypto from "crypto";

const client = new Client();
const endpoint: string = process.env.NEXT_PUBLIC_ENDPOINT as string;
const project: string = process.env.NEXT_PUBLIC_PROJECT as string;
client
    .setEndpoint(endpoint)
    .setProject(project);

const account = new Account(client);

const signupSchema = object({
    username: string(),
    email: string(),
    password: string(),
});

export interface SignupApiRequest extends NextApiRequest {
    body: TypeOf<typeof signupSchema>;
}

export default async function signup(req: SignupApiRequest, res: NextApiResponse) {
    const { username, email, password } = req.body;
    if (username === '' || email === '' || password === ''){
        res.status(400).send("Bad Request, Fields cannot be empty");
    }
    const uid = crypto.randomUUID();
    if (req.method !== "POST") {
        res.status(405).send("Method not allowed.");
    }
    const data = signupSchema.safeParse(req.body);
    if (!data.success) {
        console.log(data.error.message)
        res.status(400).send({
            message: data.error.message,
        })
    }
    try {
        const result = await account.create(uid, email, password, username);
        res.status(201).send({result})
    } catch (err) {
        console.log(err)
        res.status(500).json({err})
    }
}
