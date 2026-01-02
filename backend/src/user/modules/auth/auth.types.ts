export interface RegisterDto{
    name: string;
    email: string;
    password: string;
    phone?:string;
    address?:string;
}

export interface LoginDto{
    email: string;
    password:string
}
declare global{
    namespace Express{
        interface Request{
            authUser:{
                id:string
                email:string
                name:string
            }
        }
    }
}