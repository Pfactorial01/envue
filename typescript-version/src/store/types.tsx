type  User = {
    $id: string;
    email: string;
    name: string;
    emailVerification: boolean
    };


type  LoginState = {
    email: string
    password: string
    showPassword: boolean
    };

type  Params = {
    userId: string
    secret: string
    };


type  RegisterState = {
    username: string
    email: string
    password: string
    showPassword: boolean
    };

type  TeamState = {
    teamName: string
    };

export type {
    User,
    LoginState,
    Params,
    RegisterState,
    TeamState,
}
